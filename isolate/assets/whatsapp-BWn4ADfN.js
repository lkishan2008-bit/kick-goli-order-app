import{c as i}from"./index-Cb1Qc1xS.js";const d=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],c=i("message-circle",d),l="919945347632";function u(e,t){const n=`https://wa.me/${e}?text=${encodeURIComponent(t)}`;window.open(n,"_blank","noopener,noreferrer")}function p(e){const t=e.orderId.slice(-8).toUpperCase(),n=e.items.map(r=>`  • ${r.quantity} × ${r.nameSnapshot}`).join(`
`),o=e.deliveryAddress,s=[o.addressLine,o.landmark,o.city,o.state,o.pincode].filter(Boolean).join(", ");return`🥤 *New Kick Goli Order — #${t}*

*Customer:* ${e.customerName}
*Phone:* ${e.phone}

*Items:*
${n}

*Total:* ₹${e.totalAmount}

*Deliver to:* ${o.recipientName}
${s}
*Contact:* ${o.phone}`}function h(e){const t=e.orderId.slice(-8).toUpperCase();return`Hi! This is Kick Goli Soda.

${e.status==="out_for_delivery"?"Your Kick Goli Soda order is *out for delivery* and will reach you shortly! 🛵":"Your Kick Goli Soda order *has been confirmed* and is being prepared! 🥤"}

Order ID: *#${t}*

Thank you for ordering with us! 🙏`}export{c as M,l as S,p as a,h as b,u as o};
