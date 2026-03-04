// =============================================================================
// Tracking Script — Vanilla JS string injected into /d/[slug] viewer pages.
// Sends lightweight beacons to POST /api/deck/[slug]/track.
//
// Events: view (on load), slide_change (on navigation), complete (on unload).
// No cookies, no localStorage — fully stateless.
// =============================================================================

/**
 * Returns a self-contained <script> block (as a string) that tracks viewer
 * engagement on a shared deck page.
 *
 * @param slug  The deck slug used in the API path.
 */
export function getTrackingScript(slug: string): string {
  return `<script>
(function(){
  var API="/api/deck/${slug}/track";
  var viewId=null;
  var startTime=Date.now();
  var currentSlide=0;
  var slideStart=Date.now();

  // Detect device type from User-Agent
  var ua=navigator.userAgent||"";
  var device=/Mobi|Android/i.test(ua)?"mobile":/Tablet|iPad/i.test(ua)?"tablet":"desktop";

  // Read ?t= token from URL
  var params=new URLSearchParams(location.search);
  var token=params.get("t")||undefined;

  function send(payload,cb){
    var body=JSON.stringify(payload);
    if(navigator.sendBeacon){
      navigator.sendBeacon(API,new Blob([body],{type:"application/json"}));
      if(cb)cb();
    }else{
      fetch(API,{method:"POST",body:body,headers:{"Content-Type":"application/json"},keepalive:true})
        .then(function(r){return r.json()})
        .then(function(d){if(cb)cb(d)})
        .catch(function(){});
    }
  }

  // View event on load
  fetch(API,{method:"POST",body:JSON.stringify({event:"view",token:token,device:device}),headers:{"Content-Type":"application/json"}})
    .then(function(r){return r.json()})
    .then(function(d){viewId=d.view_id})
    .catch(function(){});

  // Listen for slide changes (presentation dispatches "slidechange" custom event)
  window.addEventListener("slidechange",function(e){
    var idx=e.detail&&typeof e.detail.index==="number"?e.detail.index:0;
    var now=Date.now();
    var dur=Math.round((now-slideStart)/1000);
    if(viewId){
      send({event:"slide_change",view_id:viewId,token:token,slide_index:currentSlide,duration:dur});
    }
    currentSlide=idx;
    slideStart=now;
  });

  // Complete event on page unload
  window.addEventListener("pagehide",function(){
    if(!viewId)return;
    var totalDur=Math.round((Date.now()-startTime)/1000);
    send({event:"complete",view_id:viewId,token:token,duration:totalDur});
  });
})();
</script>`;
}
