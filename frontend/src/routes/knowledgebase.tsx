import React, { useState, useEffect, KeyboardEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get, post } from "aws-amplify/api";
import { Conversation } from "../common/types";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessages from "../components/ChatMessages";
import LoadingGrid from "../../public/loading-grid.svg";
import Bot from "../../public/bot.png";

import ChatMessagesText from "../components/ChatMessagesText";
import "./styles.css"
import GridContainer from "../components/GridContainer";
import GridContainerHorizontal from "../components/GridContainerHorizontal";
const Knowledgebase: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = React.useState<string>("idle");
  const [messageStatus, setMessageStatus] = useState<string>("idle");
  const [conversationListStatus, setConversationListStatus] = useState<
    "idle" | "loading"
  >("idle");
  const [prompt, setPrompt] = useState("");

  const fetchData = async (conversationid = params.conversationid) => {
    // const response = await get({
    //   apiName: "serverless-pdf-chat",
    //   path: `doc/${params.documentid}/${conversationid}`
    // }).response
    // print conversationid
    console.log(conversationid)
    const conversation = {"messages":[]} as unknown as Conversation
    console.log(conversation)
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

      setPrompt("");
      // fetchData(conversation?.conversationid);
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
      FinDoc
      </label>
      </div>
      <div className="center">
      <label>
      FBI project name
      </label>
      </div>
      <div>
        <GridContainerHorizontal></GridContainerHorizontal>
      </div>
      <div className="scorecard" >
      <label>
        <div className="bold">Score card</div>
      
      </label>
        <GridContainer></GridContainer>
      </div>
      <div>
      <label>
      <div className="bold">Review</div>

      
      </label>

      <textarea name="postContent" rows={4} cols={50} onChange={(event) => console.log(event.target.value)}/>

      </div>
      {conversation && (<ChatMessagesText
                  prompt={prompt}
                  conversation={conversation}
                  messageStatus={messageStatus}
                  submitMessage={submitMessage}
                  handleKeyPress={handleKeyPress}
                  handlePromptChange={handlePromptChange}
                />
      )}
    </div>
  );
};

export default Knowledgebase;
