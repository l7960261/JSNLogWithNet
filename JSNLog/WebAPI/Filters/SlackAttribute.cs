using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Http.Filters;

namespace WebAPI.Filters
{
   internal sealed class SlackAttribute: ExceptionFilterAttribute
   {
      public override void OnException(HttpActionExecutedContext actionExecutedContext) {
         if (actionExecutedContext.Exception != null) {
            // progress Exception & call slack web api
            PostMessage("測試(中文) - 發生錯誤 !");
         }

         base.OnException(actionExecutedContext);
      }

      public static void PostMessage(string Message) {
         var settings = new Dictionary<string, string> {
            { "token", "" },
            { "channel", "" },
            { "username", "WEB API BOT" },
            { "text", Message }
         };
         var param = string.Join("&", settings.Keys.Select(key => string.Format("{0}={1}", HttpUtility.UrlEncode(key), HttpUtility.UrlEncode(settings[key]))));
         var query =Encoding.ASCII.GetBytes(param);

         var request = (HttpWebRequest)WebRequest.Create("https://slack.com/api/chat.postMessage");
         string result;
         request.Timeout = 15000;
         request.ContentType = "application/x-www-form-urlencoded";
         request.Method = "POST";
         request.ContentLength = query.Length;

         using (var requestStream = request.GetRequestStream()) {
            requestStream.Write(query, 0, query.Length);
         }

         using (var response = (HttpWebResponse)request.GetResponse()) {
            using (var responseStream = response.GetResponseStream()) {
               if (responseStream == null) {
                  result = "";
               }
               using (var reader = new StreamReader(responseStream)) {
                  result = reader.ReadToEnd();
               }
            }
         }
      }
   }
}