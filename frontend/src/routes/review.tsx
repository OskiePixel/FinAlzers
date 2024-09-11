import React, { useState, useEffect, KeyboardEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get, post } from "aws-amplify/api";
import { Conversation } from "../common/types";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessages from "../components/ChatMessages";
import LoadingGrid from "../../public/loading-grid.svg";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Bot from "../../public/bot.png";

const Review: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = React.useState<string>("idle");
  const [messageStatus, setMessageStatus] = useState<string>("idle");
  const [conversationListStatus, setConversationListStatus] = useState<
    "idle" | "loading"
  >("idle");
  const [prompt, setPrompt] = useState("");
  interface User {
    project: string;
    workdocs: string;
    region: any;
    status: string;
    talk?: string;
  }
  const [rowData, setRowData] = useState<User[]>([
    { project: "FBI project 1", workdocs: 'Content', region: [], status: 'In progress' },
    { project: "FBI project 2", workdocs: 'Content', region: [], status: 'Completed' },
    { project: "FBI project 3", workdocs: 'Content', region: ["NA","EMEA"], status: '' },
    { project: "FBI project 4", workdocs: 'Content', region: ["Global"], status: '' },
  ]);

  const columnDefs = [
    { field: 'project', headerName: 'Project name' },
    { field: 'workdocs', headerName: 'workdocs url' },
    { field: 'region', headerName: 'Region(s)' },
    { field: 'status', headerName: 'status' },
    { field: 'talk', headerName: 'talk' },
  ];

  const fetchData = async (conversationid = params.conversationid) => {
    const response = await get({
      apiName: "serverless-pdf-chat",
      path: `doc/${params.documentid}/${conversationid}`
    }).response
    const conversation = await response.body.json() as unknown as Conversation
    setConversation(conversation);
    console.log("Foo")
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const addConversation = async () => {
    setConversationListStatus("loading");
    const response = await post({
      apiName: "serverless-pdf-chat",
      path: `doc/${params.documentid}`
    }).response;
    const newConversation = await response.body.json() as unknown as Conversation;
    fetchData(newConversation.conversationid);
    navigate(`/doc/${params.documentid}/${newConversation.conversationid}`);
    setConversationListStatus("idle");
  };

  const switchConversation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const targetButton = e.target as HTMLButtonElement;
    navigate(`/doc/${params.documentid}/${targetButton.id}`);
    fetchData(targetButton.id);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      submitMessage();
    }
  };

  const submitMessage = async () => {
    setMessageStatus("loading");

    if (conversation !== null) {
      const previewMessage = {
        type: "text",
        data: {
          content: prompt,
          additional_kwargs: {},
          example: false,
        },
      };

      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, previewMessage],
      };

      setConversation(updatedConversation);


      await post({
        apiName: "serverless-pdf-chat",
        path: `${conversation?.document.documentid}/${conversation?.conversationid}`,
        options: {
          body: {
            fileName: conversation?.document.filename,
            prompt: prompt,
          }
        }
      }).response;
      setPrompt("");
      fetchData(conversation?.conversationid);
      setMessageStatus("idle");
    }
  };

  return (
<div className="">
    <div className="center bot">
      <img src={Bot} />
      </div>
      <div className="center bold">
      <label>
      FinDoc Document store
      </label>
      </div>
    <div className="ag-theme-alpine" style={{ height: 400, width: 1000 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
    </div>
  );
};

export default Review;
