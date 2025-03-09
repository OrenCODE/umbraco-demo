using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Nikcio.UHeadless;
using Nikcio.UHeadless.Defaults.ContentItems;
using Umbraco.Cms.Web.Common.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// 1. Configure Umbraco + UHeadless
builder
    .CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddDeliveryApi()
    .AddComposers()
    .AddUHeadless(options =>
    {
        // Allows anonymous GraphQL queries (for dev/testing)
        // In production, you might enable authorization
        options.DisableAuthorization = true;

        // Adds default queries (e.g., contentAtRoot, etc.)
        options.AddDefaults();

        // Add extra queries you need:
        options.AddQuery<ContentByRouteQuery>();
        options.AddQuery<ContentAtRootQuery>();
        options.AddQuery<ContentByGuidQuery>();
        // For example, to fetch by numeric ID:
        // options.AddQuery<ContentByIdQuery>();
    })
    .Build();

WebApplication app = builder.Build();

// 2. Boot Umbraco
await app.BootUmbracoAsync();

// 3. (Optional) Use authentication/authorization if you need it
app.UseAuthentication();
app.UseAuthorization();

// 4. Map the UHeadless GraphQL endpoint (/graphql)
app.MapUHeadless();

// 5. Continue with the standard Umbraco pipeline
app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

// 6. Run the application
await app.RunAsync();
