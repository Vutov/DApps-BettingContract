using System.Collections.Generic;

namespace Admin.Data
{
    using System.Linq;

    public class Result
    {
        protected Result(bool status, params string[] messages)
        {
            this.Success = status;
            this.Messages = messages.ToList();
        }

        public bool Success { get; }

        public List<string> Messages { get; }

        public string GetListMessages()
        {
            return string.Join(", ", this.Messages);
        }

        public static Result Ok(params string[] messages)
        {
            return new Result(true, messages);
        }

        public static Result Fail(params string[] messages)
        {
            return new Result(false, messages);
        }
    }

    public class Result<T> : Result
    {
        protected Result(bool status, T value, params string[] messages): base(status, messages)
        {
            this.Value = value;
        }

        public T Value { get; }
        
        public static Result<T> Ok(T value, params string[] messages)
        {
            return new Result<T>(true, value, messages);
        }

        public new static Result<T> Fail(params string[] messages)
        {
            return new Result<T>(false, default(T), messages);
        }
    }
}