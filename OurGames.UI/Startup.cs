using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OurGames.Core.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using OurGames.Core.Entity;
using OurGames.UI.Services.Abstractions;
using OurGames.UI.Services;

namespace OurGames.UI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private readonly string OurGamesCorsSpecification = "_ourGamesCors";


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddCors(options =>
            {
                options.AddPolicy(OurGamesCorsSpecification,
                builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });

            services.Configure<OurGamesUIConfig>(Configuration.GetSection("App"));

            //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            //{
            //    options.Audience = "1:749808442683:web:ccb541716636dbaaf02b1e";
            //    options.Authority = "https://securetoken.google.com/1:749808442683:web:ccb541716636dbaaf02b1e";
            //    //options.Events = new JwtBearerEvents
            //    //{
            //    //    OnMessageReceived = context =>
            //    //    {
            //    //        var accessToken = context.Request.Query["access_token"];
            //    //        var path = context.HttpContext.Request.Path;
            //    //        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/sockjs-node"))
            //    //        {
            //    //            context.Token = accessToken;
            //    //        }
            //    //        return Task.CompletedTask;
            //    //    }
            //    //};
            //});

            services.AddTransient<IPagSeguroPayment, PagSeguroPayment>();

            services.AddTransient<IEmailSender, EmailSender>();

            services.AddDbContext<OurGamesContext>(
                options => options.UseSqlServer(Configuration.GetConnectionString("OurGamesDB")));

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseCors(OurGamesCorsSpecification);

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseSpaStaticFiles();

            //app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
