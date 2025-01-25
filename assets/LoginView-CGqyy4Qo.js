import{d as u,u as f,r as i,o as a,c as n,a as e,b as d,t as c,e as v,f as x,g as p}from"./index-Cwt7J1oP.js";const w={class:"space-y-6"},h=["disabled"],_={key:0,class:"mt-4 p-3 rounded-lg bg-red-50 border border-red-200"},b={class:"text-sm text-red-600 flex items-center gap-2"},y=u({__name:"LoginForm",setup(m){const l=f(),t=i(!1),s=i("");async function g(){try{t.value=!0,s.value="",await l.loginWithProvider("github")}catch(r){s.value=r instanceof Error?r.message:"An error occurred"}finally{t.value=!1}}return(r,o)=>(a(),n("div",w,[e("div",null,[e("button",{type:"button",onClick:g,disabled:t.value,class:"w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg shadow-md bg-[#24292F] text-white font-medium hover:bg-[#1a1e23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#24292F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"},[o[0]||(o[0]=e("svg",{class:"h-5 w-5",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor"},[e("path",{d:"M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"})],-1)),d(" "+c(t.value?"Signing in...":"Continue with GitHub"),1)],8,h)]),s.value?(a(),n("div",_,[e("p",b,[o[1]||(o[1]=e("svg",{class:"h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor"},[e("path",{"fill-rule":"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z","clip-rule":"evenodd"})],-1)),d(" "+c(s.value),1)])])):v("",!0)]))}}),k={class:"min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"},V={class:"mt-8 sm:mx-auto sm:w-full sm:max-w-md"},B={class:"bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100"},L=u({__name:"LoginView",setup(m){return(l,t)=>(a(),n("div",k,[t[0]||(t[0]=x('<div class="sm:mx-auto sm:w-full sm:max-w-md"><div class="flex justify-center"><div class="h-16 w-16 bg-indigo-600 rounded-lg flex items-center justify-center"><svg class="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div></div><h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2><p class="mt-2 text-center text-sm text-gray-600"> Sign in to manage your leave requests </p></div>',1)),e("div",V,[e("div",B,[p(y)])])]))}});export{L as default};
