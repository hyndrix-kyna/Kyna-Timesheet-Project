(()=>{var e={};e.id=888,e.ids=[888],e.modules={2397:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>o});var i=r(997),l=r(1649),a=r(1163);r(108);var t=r(1664),c=r.n(t);function n(){return(0,i.jsx)("nav",{className:"bg-gray-800 text-white p-4",children:(0,i.jsxs)("div",{className:"container mx-auto flex justify-between",children:[(0,i.jsx)("div",{className:"text-lg font-bold",children:(0,i.jsx)(c(),{href:"/",children:"My Website"})}),(0,i.jsx)("div",{children:(0,i.jsxs)("ul",{className:"flex space-x-4",children:[(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/",className:"hover:text-gray-300",children:"Home"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/about",className:"hover:text-gray-300",children:"About"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/contact",className:"hover:text-gray-300",children:"Contact Us"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/inquiries",className:"hover:text-gray-300",children:"Inquiries"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/account/login",className:"hover:text-gray-300",children:"Sign In"})})]})})]})})}var d=r(6689);function x(){let[e,s]=(0,d.useState)(!1),{data:r}=(0,l.useSession)();return(0,i.jsx)("div",{className:"w-64 h-screen bg-gray-800 text-white flex flex-col fixed",children:(0,i.jsxs)("div",{className:"p-4",children:[(0,i.jsxs)("div",{className:"flex items-center mb-6",children:[(0,i.jsx)("div",{className:"bg-gray-600 rounded-full w-12 h-12 flex items-center justify-center mr-3",children:(0,i.jsx)("span",{className:"text-lg",children:"\uD83D\uDC64"})}),(0,i.jsxs)("div",{className:"relative",children:[r&&r.user?(0,i.jsxs)("p",{className:"text-lg font-semibold cursor-pointer",onClick:()=>{s(!e)},children:[`${r.user.firstName} ${r.user.lastName}`," ▼"]}):(0,i.jsx)("p",{children:"Loading..."}),e&&(0,i.jsx)("div",{className:"absolute bg-gray-700 mt-2 rounded shadow-lg w-48",children:(0,i.jsxs)("ul",{children:[(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/app/account-settings",className:"block py-2 px-4 hover:bg-gray-600 rounded",children:"Account Settings"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/account/login",className:"block py-2 px-4 hover:bg-gray-600 rounded",children:"Log Out"})})]})})]})]}),(0,i.jsx)("nav",{className:"flex-grow",children:(0,i.jsxs)("ul",{className:"space-y-2",children:[(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/app/dashboard",className:"block py-2 px-4 hover:bg-gray-700 rounded",children:"Dashboard"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/app/employees",className:"block py-2 px-4 hover:bg-gray-700 rounded",children:"Employees"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/app/timesheet",className:"block py-2 px-4 hover:bg-gray-700 rounded",children:"Timesheet"})})]})})]})})}let o=function({Component:e,pageProps:{session:s,...r}}){let t=(0,a.useRouter)().pathname.startsWith("/app");return(0,i.jsx)(l.SessionProvider,{session:s,children:(0,i.jsxs)("div",{className:"flex",children:[t&&(0,i.jsx)(x,{}),(0,i.jsxs)("main",{className:t?"ml-64 flex-grow p-6":"w-full",children:[!t&&(0,i.jsx)(n,{}),(0,i.jsx)(e,{...r})]})]})})}},108:()=>{},1649:e=>{"use strict";e.exports=require("next-auth/react")},2785:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{"use strict";e.exports=require("react")},6405:e=>{"use strict";e.exports=require("react-dom")},997:e=>{"use strict";e.exports=require("react/jsx-runtime")},2048:e=>{"use strict";e.exports=require("fs")},6162:e=>{"use strict";e.exports=require("stream")},1568:e=>{"use strict";e.exports=require("zlib")}};var s=require("../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),i=s.X(0,[706,424],()=>r(2397));module.exports=i})();