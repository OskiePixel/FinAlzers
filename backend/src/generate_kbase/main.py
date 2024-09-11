import warnings

from io import StringIO
import sys
import textwrap
import os
from typing import Optional
import boto3


DOCUMENT_TABLE = os.environ["DOCUMENT_TABLE"]
BUCKET = os.environ["BUCKET"]
EMBEDDING_MODEL_ID = os.environ["EMBEDDING_MODEL_ID"]

s3 = boto3.client("s3")
ddb = boto3.resource("dynamodb")
document_table = ddb.Table(DOCUMENT_TABLE)
logger = Logger()


@logger.inject_lambda_context(log_event=True)
def lambda_handler(event, context):
        print("Embedding model Id :", modelId)
