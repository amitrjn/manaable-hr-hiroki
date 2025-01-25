import{n as S,r as f,m as y,u as v,d as U,s as C,l as E,c as i,a as t,h as d,t as m,e as w,F as _,p as b,o as c,q as M,v as k}from"./index-Cwt7J1oP.js";const F=S("user",()=>{const x=f([]),n=f(!1),l=f(null);async function u(){try{n.value=!0,l.value=null;const{data:r,error:p}=await y.from("users").select("*").order("name");if(p)throw p;x.value=r}catch(r){throw l.value=r instanceof Error?r.message:"Failed to fetch users",r}finally{n.value=!1}}async function g(r,p){var o;try{n.value=!0,l.value=null;const{error:e}=await y.from("users").update({role:p,updated_at:new Date().toISOString()}).eq("id",r);if(e)throw e;await u();const s=v();r===((o=s.currentUser)==null?void 0:o.id)&&await s.init()}catch(e){throw l.value=e instanceof Error?e.message:"Failed to update user role",e}finally{n.value=!1}}async function h(r,p){var o;try{n.value=!0,l.value=null;const{error:e}=await y.from("users").update({manager_id:p,updated_at:new Date().toISOString()}).eq("id",r);if(e)throw e;await u();const s=v();r===((o=s.currentUser)==null?void 0:o.id)&&await s.init()}catch(e){throw l.value=e instanceof Error?e.message:"Failed to assign manager",e}finally{n.value=!1}}return{users:x,loading:n,error:l,fetchAllUsers:u,updateUserRole:g,assignManager:h}}),A={class:"min-h-screen bg-gray-100"},V={class:"max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"},L={class:"px-4 py-6 sm:px-0"},N={key:0,class:"mb-4 bg-red-50 border border-red-200 rounded-md p-4"},R={class:"flex"},B={class:"ml-3"},D={class:"text-sm text-red-700"},q={class:"bg-white shadow overflow-hidden sm:rounded-lg"},z={class:"overflow-x-auto"},O={class:"min-w-full divide-y divide-gray-200"},I={class:"bg-white divide-y divide-gray-200"},T={key:0},j={key:1},G={class:"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"},H={class:"px-6 py-4 whitespace-nowrap text-sm text-gray-500"},J={class:"px-6 py-4 whitespace-nowrap text-sm text-gray-500"},K=["onUpdate:modelValue","disabled","onChange"],P={class:"px-6 py-4 whitespace-nowrap text-sm text-gray-500"},Q=["onUpdate:modelValue","disabled","onChange"],W=["value"],X={class:"px-6 py-4 whitespace-nowrap text-right text-sm font-medium"},Y={key:0,class:"text-gray-400"},$=U({__name:"UserManagementView",setup(x){const n=F(),{users:l,loading:u,error:g}=C(n),h=o=>l.value.filter(e=>e.id!==o.id&&(e.role==="Manager"||e.role==="Admin"));async function r(o,e){const s=e.target.value;try{await n.updateUserRole(o,s)}catch(a){console.error("Failed to update role:",a)}}async function p(o,e){const s=e.target.value||null;try{await n.assignManager(o,s)}catch(a){console.error("Failed to assign manager:",a)}}return E(async()=>{try{await n.fetchAllUsers()}catch(o){console.error("Failed to fetch users:",o)}}),(o,e)=>(c(),i("div",A,[e[6]||(e[6]=t("header",{class:"bg-white shadow"},[t("div",{class:"max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"},[t("h1",{class:"text-3xl font-bold text-gray-900"},"User Management")])],-1)),t("main",null,[t("div",V,[t("div",L,[d(g)?(c(),i("div",N,[t("div",R,[e[0]||(e[0]=t("div",{class:"flex-shrink-0"},[t("svg",{class:"h-5 w-5 text-red-400",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor"},[t("path",{"fill-rule":"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z","clip-rule":"evenodd"})])],-1)),t("div",B,[t("p",D,m(d(g)),1)])])])):w("",!0),t("div",q,[t("div",z,[t("table",O,[e[5]||(e[5]=t("thead",{class:"bg-gray-50"},[t("tr",null,[t("th",{scope:"col",class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Name "),t("th",{scope:"col",class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Email "),t("th",{scope:"col",class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Role "),t("th",{scope:"col",class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Manager "),t("th",{scope:"col",class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Actions ")])],-1)),t("tbody",I,[d(u)&&!d(l).length?(c(),i("tr",T,e[1]||(e[1]=[t("td",{colspan:"5",class:"px-6 py-4 text-center text-sm text-gray-500"}," Loading users... ",-1)]))):d(l).length?w("",!0):(c(),i("tr",j,e[2]||(e[2]=[t("td",{colspan:"5",class:"px-6 py-4 text-center text-sm text-gray-500"}," No users found ",-1)]))),(c(!0),i(_,null,b(d(l),s=>(c(),i("tr",{key:s.id,class:"hover:bg-gray-50"},[t("td",G,m(s.name),1),t("td",H,m(s.email),1),t("td",J,[M(t("select",{"onUpdate:modelValue":a=>s.role=a,class:"mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",disabled:d(u),onChange:a=>r(s.id,a)},e[3]||(e[3]=[t("option",{value:"Member"},"Member",-1),t("option",{value:"Manager"},"Manager",-1),t("option",{value:"Admin"},"Admin",-1)]),40,K),[[k,s.role]])]),t("td",P,[M(t("select",{"onUpdate:modelValue":a=>s.manager_id=a,class:"mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",disabled:d(u),onChange:a=>p(s.id,a)},[e[4]||(e[4]=t("option",{value:null},"No Manager",-1)),(c(!0),i(_,null,b(h(s),a=>(c(),i("option",{key:a.id,value:a.id},m(a.name),9,W))),128))],40,Q),[[k,s.manager_id]])]),t("td",X,[d(u)?(c(),i("span",Y," Saving... ")):w("",!0)])]))),128))])])])])])])])]))}});export{$ as default};
