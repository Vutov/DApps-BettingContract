using System;

namespace Admin.Extensions
{
    using System.Numerics;

    public static class DateTimeExtensions
    {
        public static DateTime UnixTimeStampToDateTime(BigInteger unixTimeStamp)
        {
            DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds((double)unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }
    }
}
