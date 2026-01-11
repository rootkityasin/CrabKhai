// BotID initialization removed
// import { initBotId } from 'botid/client/core';

// // Initialize BotID protection
// // Protect critical API endpoints and server actions
// initBotId({
//     protect: [
//         {
//             // Protect all API routes
//             path: '/api/*',
//             method: 'POST',
//         },
//         {
//             // Protect server actions (these often don't have stable paths,
//             // but if we have specific routes we'd add them here.
//             // For now, general API protection is a good start.
//             // App Router server actions use POST to the same page URL usually,
//             // but BotID handles headers globally if initialized.)
//             path: '/cart/*', // Example: if there's a checkout flow here
//             method: 'POST',
//         },
//         {
//             path: '/auth/*',
//             method: 'POST',
//         },
//     ],
// });
