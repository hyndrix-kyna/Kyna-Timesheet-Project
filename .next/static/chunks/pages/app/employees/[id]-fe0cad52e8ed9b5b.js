(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[542],{5380:(e,a,l)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/app/employees/[id]",function(){return l(2977)}])},2977:(e,a,l)=>{"use strict";l.r(a),l.d(a,{default:()=>r});var t=l(5893),s=l(7294),n=l(1163);function r(){let[e,a]=(0,s.useState)({firstName:"",lastName:"",gender:"",employeeNo:""}),l=(0,n.useRouter)(),{id:r}=l.query;(0,s.useEffect)(()=>{r&&(async()=>{let e=await fetch("/api/employee/".concat(r));a(await e.json())})()},[r]);let d=async a=>{a.preventDefault(),(await fetch("/api/employee/".concat(r),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({firstName:e.firstName,lastName:e.lastName,gender:e.gender})})).ok&&l.push("/app/employees")};return(0,t.jsxs)("div",{className:"container mx-auto p-6",children:[(0,t.jsx)("h1",{className:"text-2xl font-bold mb-6",children:"Edit Employee"}),(0,t.jsxs)("form",{onSubmit:d,children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{children:"First Name"}),(0,t.jsx)("input",{type:"text",value:e.firstName,onChange:l=>a({...e,firstName:l.target.value}),className:"border p-2 rounded w-full"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{children:"Last Name"}),(0,t.jsx)("input",{type:"text",value:e.lastName,onChange:l=>a({...e,lastName:l.target.value}),className:"border p-2 rounded w-full"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{children:"Gender"}),(0,t.jsxs)("select",{value:e.gender,onChange:l=>a({...e,gender:l.target.value}),className:"border p-2 rounded w-full",children:[(0,t.jsx)("option",{value:"Male",children:"Male"}),(0,t.jsx)("option",{value:"Female",children:"Female"}),(0,t.jsx)("option",{value:"Other",children:"Other"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{children:"Employee No (Read-Only)"}),(0,t.jsx)("input",{type:"text",value:e.employeeNo,readOnly:!0,className:"border p-2 rounded w-full bg-gray-100 cursor-not-allowed"})]}),(0,t.jsx)("button",{type:"submit",className:"mt-4 bg-blue-500 text-white py-2 px-4 rounded",children:"Submit"})]})]})}}},e=>{var a=a=>e(e.s=a);e.O(0,[888,774,179],()=>a(5380)),_N_E=e.O()}]);