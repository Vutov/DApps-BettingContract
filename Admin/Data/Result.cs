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

        public bool Success { get; set; }
        public List<string> Messages { get; set; }

        public static Result Ok(params string[] messages)
        {
            return new Result(true, messages);
        }

        public static Result Fail(params string[] messages)
        {
            return new Result(false, messages);
        }
    }
}
