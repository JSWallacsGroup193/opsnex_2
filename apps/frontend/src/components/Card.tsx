
export function Card({ title, value }: { title:string; value:string|number }) {
  return (
    <div style={{background:'#fff',padding:'16px',borderRadius:8,boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
      <div style={{fontSize:12,color:'#6b7280',marginBottom:6}}>{title}</div>
      <div style={{fontSize:24,fontWeight:700}}>{value}</div>
    </div>
  )
}
