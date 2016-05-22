using System.Web.Http.Filters;

namespace WebAPI.Filters
{
   internal sealed class SlackAttribute: ExceptionFilterAttribute
   {
      public override void OnException(HttpActionExecutedContext actionExecutedContext) {
         if (actionExecutedContext.Exception != null) {
            // progress Exception & call slack web api
         }

         base.OnException(actionExecutedContext);
      }
   }
}