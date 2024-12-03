import { Request, Response } from 'express';

export interface FulfillmentResponse {
    messages?: Array<{
        text?: { text: string[] };
        payload?: Record<string, any>;
        [key: string]: any;
    }>;
    payload?: Record<string, any>;
}

export interface SessionInfo {
    session: string;
    parameters?: Record<string, any>;
}

export interface WebhookRequest extends Request {
    queryResult?: {
        intent?: { name: string; displayName: string };
        parameters?: Record<string, any>;
        fulfillmentInfo?: { tag: string };
        [key: string]: any;
    };
    sessionInfo?: SessionInfo;
    originalDetectIntentRequest?: Record<string, any>;
}

export interface WebhookResponse extends Response {
    fulfillmentResponse?: FulfillmentResponse;
    sessionInfo?: SessionInfo;
    endInteraction?: boolean;
    payload?: Record<string, any>;
}