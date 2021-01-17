using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;

[assembly: OwinStartup(typeof(BorcDefteriApi.Startup))]

namespace BorcDefteriApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // https://stackoverflow.com/questions/36285253/enable-cors-for-web-api-2-and-owin-token-authentication
            app.UseCors(CorsOptions.AllowAll);
            ConfigureAuth(app);
        }
    }
}
