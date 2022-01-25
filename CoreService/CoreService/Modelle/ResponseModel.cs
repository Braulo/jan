﻿namespace CoreService.Modelle
{
    public class ResponseModel
    {
        private string _responseId;
        private string _responseDateTime;
        private bool _result;
        private string _message;

        public string ResponseId { get => _responseId; set => _responseId = value; }
        public string ResponseDateTime { get => _responseDateTime; set => _responseDateTime = value; }
        public bool Result { get => _result; set => _result = value; }
        public string Message { get => _message; set => _message = value; }
    }
}
