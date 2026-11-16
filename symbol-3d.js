/* Niebla Studios — símbolo 3D del hero (WebGL nativo, sin dependencias).
   Geometría: contornos extraídos de assets/logo.png, extruidos con profundidad. */
(function(){
"use strict";
const SHAPES=[[[0.52,0.9544],[0.509,0.951],[0.4989,0.9449],[0.4888,0.9389],[0.4787,0.9328],[0.4683,0.9276],[0.4581,0.9216],[0.4479,0.9159],[0.4377,0.91],[0.4275,0.9042],[0.4174,0.8984],[0.4071,0.8926],[0.397,0.8867],[0.3868,0.8809],[0.3766,0.8751],[0.3665,0.869],[0.3564,0.863],[0.346,0.8575],[0.3358,0.8518],[0.3257,0.8457],[0.3156,0.8397],[0.3053,0.8342],[0.295,0.8285],[0.2849,0.8224],[0.2749,0.8164],[0.2646,0.8108],[0.2545,0.8047],[0.2442,0.7991],[0.2341,0.7931],[0.2238,0.7875],[0.2135,0.7819],[0.2034,0.7759],[0.1933,0.7698],[0.183,0.7642],[0.1729,0.7582],[0.1626,0.7526],[0.1525,0.7465],[0.1422,0.7409],[0.1321,0.7349],[0.1218,0.7293],[0.1118,0.7232],[0.1015,0.7176],[0.0914,0.7116],[0.0811,0.706],[0.071,0.6999],[0.0609,0.6939],[0.0508,0.6878],[0.0405,0.6823],[0.0304,0.6762],[0.0201,0.6706],[0.01,0.6646],[-0.0003,0.659],[-0.0103,0.6529],[-0.0206,0.6473],[-0.0307,0.6413],[-0.0408,0.6352],[-0.0511,0.6296],[-0.0612,0.6236],[-0.0715,0.618],[-0.0818,0.6124],[-0.0919,0.6063],[-0.102,0.6003],[-0.1123,0.5947],[-0.1224,0.5886],[-0.1327,0.583],[-0.1428,0.577],[-0.1531,0.5714],[-0.1631,0.5654],[-0.1734,0.5597],[-0.1835,0.5537],[-0.1938,0.5481],[-0.2039,0.5421],[-0.2142,0.5364],[-0.2243,0.5304],[-0.2344,0.5244],[-0.2445,0.5183],[-0.2548,0.5127],[-0.2649,0.5067],[-0.2752,0.5011],[-0.2852,0.495],[-0.2955,0.4894],[-0.3056,0.4834],[-0.3159,0.4778],[-0.3258,0.4714],[-0.3355,0.4649],[-0.3453,0.4584],[-0.3551,0.4519],[-0.3646,0.4451],[-0.3741,0.4381],[-0.3835,0.4311],[-0.3927,0.4238],[-0.4019,0.4164],[-0.4106,0.4086],[-0.419,0.4004],[-0.4282,0.393],[-0.4369,0.3852],[-0.4452,0.3769],[-0.4531,0.3682],[-0.4605,0.359],[-0.4686,0.3505],[-0.4762,0.3416],[-0.4835,0.3324],[-0.4909,0.3232],[-0.4978,0.3137],[-0.5044,0.304],[-0.511,0.2943],[-0.5177,0.2847],[-0.5232,0.2743],[-0.5289,0.2641],[-0.5349,0.254],[-0.5401,0.2435],[-0.5446,0.2326],[-0.549,0.2217],[-0.5528,0.2106],[-0.5561,0.1994],[-0.5594,0.1882],[-0.562,0.1767],[-0.5643,0.1652],[-0.5647,0.1535],[-0.5647,0.1417],[-0.5647,0.13],[-0.5647,0.1182],[-0.564,0.1065],[-0.5616,0.095],[-0.5593,0.0835],[-0.556,0.0723],[-0.5516,0.0614],[-0.5472,0.0504],[-0.5419,0.04],[-0.5363,0.0297],[-0.5299,0.0199],[-0.523,0.0104],[-0.5153,0.0015],[-0.508,-0.0077],[-0.4993,-0.0155],[-0.4902,-0.023],[-0.4813,-0.0306],[-0.4716,-0.0372],[-0.4616,-0.0434],[-0.4515,-0.0494],[-0.4414,-0.0555],[-0.4313,-0.0615],[-0.421,-0.0671],[-0.4109,-0.0731],[-0.4006,-0.0787],[-0.3905,-0.0848],[-0.3802,-0.0904],[-0.3702,-0.0964],[-0.3597,-0.1017],[-0.3493,-0.1071],[-0.339,-0.1128],[-0.3289,-0.1187],[-0.3186,-0.1244],[-0.3085,-0.1304],[-0.298,-0.1356],[-0.2877,-0.1412],[-0.2776,-0.1472],[-0.2671,-0.1524],[-0.257,-0.1584],[-0.2467,-0.164],[-0.2362,-0.1693],[-0.2259,-0.1748],[-0.2158,-0.1808],[-0.2054,-0.1864],[-0.1949,-0.1916],[-0.1872,-0.1945],[-0.197,-0.188],[-0.2064,-0.181],[-0.2157,-0.1738],[-0.2251,-0.1667],[-0.2345,-0.1597],[-0.2437,-0.1524],[-0.2529,-0.1451],[-0.2615,-0.1371],[-0.2698,-0.1288],[-0.2781,-0.1204],[-0.2863,-0.112],[-0.2934,-0.1027],[-0.2999,-0.0929],[-0.3057,-0.0827],[-0.3106,-0.072],[-0.3135,-0.0607],[-0.3147,-0.049],[-0.3142,-0.0373],[-0.311,-0.0261],[-0.3067,-0.0152],[-0.3005,-0.0053],[-0.2937,0.0042],[-0.2857,0.0128],[-0.2772,0.0209],[-0.268,0.0283],[-0.2588,0.0356],[-0.2494,0.0426],[-0.2401,0.0498],[-0.2306,0.0567],[-0.2208,0.0631],[-0.211,0.0696],[-0.2012,0.076],[-0.1911,0.0821],[-0.181,0.0881],[-0.171,0.0942],[-0.1609,0.1002],[-0.1508,0.1063],[-0.1405,0.1119],[-0.1304,0.1179],[-0.1201,0.1235],[-0.11,0.1296],[-0.0997,0.1352],[-0.0896,0.1412],[-0.0796,0.1473],[-0.0692,0.1529],[-0.0592,0.1589],[-0.0489,0.1645],[-0.0388,0.1706],[-0.0287,0.1766],[-0.0186,0.1827],[-0.0083,0.1883],[0.0018,0.1943],[0.0123,0.1994],[0.0224,0.2055],[0.0325,0.2115],[0.0426,0.2176],[0.0529,0.2232],[0.0629,0.2292],[0.0732,0.2348],[0.0833,0.2409],[0.0936,0.2465],[0.1037,0.2525],[0.114,0.2581],[0.1241,0.2642],[0.1344,0.2698],[0.1445,0.2758],[0.1548,0.2814],[0.1649,0.2875],[0.1752,0.2931],[0.1853,0.2991],[0.1956,0.3047],[0.2057,0.3107],[0.216,0.3163],[0.226,0.3224],[0.2361,0.3284],[0.2464,0.3341],[0.2567,0.3396],[0.2668,0.3457],[0.2769,0.3517],[0.2871,0.3575],[0.2973,0.3634],[0.3074,0.3694],[0.3175,0.3755],[0.3278,0.3811],[0.3378,0.3871],[0.3481,0.3927],[0.3582,0.3988],[0.3685,0.4044],[0.3786,0.4104],[0.3889,0.416],[0.399,0.4221],[0.4093,0.4276],[0.4194,0.4337],[0.4297,0.4393],[0.4398,0.4453],[0.4496,0.4517],[0.4591,0.4587],[0.4679,0.4664],[0.4762,0.4747],[0.4843,0.4833],[0.4916,0.4925],[0.4981,0.5022],[0.5042,0.5123],[0.5092,0.5229],[0.5135,0.5338],[0.5169,0.545],[0.5198,0.5564],[0.5215,0.568],[0.5235,0.5795],[0.5235,0.5913],[0.5235,0.6031],[0.5235,0.6148],[0.5235,0.6266],[0.5235,0.6383],[0.5235,0.6501],[0.5235,0.6618],[0.5235,0.6736],[0.5235,0.6854],[0.5235,0.6971],[0.5235,0.7089],[0.5235,0.7206],[0.5235,0.7324],[0.5235,0.7441],[0.5235,0.7559],[0.5235,0.7677],[0.5235,0.7794],[0.5235,0.7912],[0.5235,0.8029],[0.5235,0.8147],[0.5235,0.8264],[0.5235,0.8382],[0.5235,0.85],[0.5235,0.8617],[0.5235,0.8735],[0.5235,0.8852],[0.5235,0.897],[0.5235,0.9087],[0.5235,0.9205],[0.5235,0.9323],[0.5235,0.944]],[[0.1412,0.1297],[0.1296,0.1279],[0.1178,0.1279],[0.1062,0.1268],[0.0946,0.125],[0.083,0.1234],[0.0716,0.1205],[0.0602,0.1176],[0.0491,0.114],[0.038,0.1102],[0.0273,0.1055],[0.0172,0.0994],[0.0101,0.0904],[0.0144,0.0801],[0.0237,0.0731],[0.0335,0.0666],[0.0436,0.0606],[0.0534,0.0541],[0.0632,0.0477],[0.073,0.0412],[0.0831,0.0351],[0.0929,0.0287],[0.1027,0.0222],[0.1125,0.0157],[0.1226,0.0097],[0.1324,0.0032],[0.1422,-0.0033],[0.152,-0.0097],[0.1621,-0.0158],[0.1718,-0.0224],[0.181,-0.0298],[0.1901,-0.0371],[0.1991,-0.0447],[0.2066,-0.0538],[0.2127,-0.0638],[0.218,-0.0743],[0.2206,-0.0857],[0.2202,-0.0974],[0.2171,-0.1087],[0.2122,-0.1194],[0.2051,-0.1287],[0.1968,-0.137],[0.1885,-0.1453],[0.1793,-0.1527],[0.1695,-0.1592],[0.1594,-0.1652],[0.1489,-0.1704],[0.1388,-0.1764],[0.1285,-0.182],[0.118,-0.1872],[0.1076,-0.1928],[0.0976,-0.1988],[0.0872,-0.2043],[0.0767,-0.2096],[0.0662,-0.2147],[0.0561,-0.2208],[0.0458,-0.2264],[0.0352,-0.2315],[0.0249,-0.2371],[0.0148,-0.2432],[0.0044,-0.2485],[-0.006,-0.2539],[-0.0166,-0.2591],[-0.0266,-0.2651],[-0.037,-0.2707],[-0.0475,-0.2759],[-0.058,-0.2811],[-0.0681,-0.2871],[-0.0784,-0.2928],[-0.0888,-0.2982],[-0.0991,-0.3038],[-0.1092,-0.3098],[-0.1197,-0.315],[-0.1302,-0.3202],[-0.1405,-0.3258],[-0.1506,-0.3318],[-0.1611,-0.3371],[-0.1715,-0.3426],[-0.1816,-0.3486],[-0.1919,-0.3541],[-0.2024,-0.3594],[-0.213,-0.3645],[-0.2233,-0.3701],[-0.2334,-0.3762],[-0.2439,-0.3814],[-0.2543,-0.3867],[-0.2647,-0.3921],[-0.2748,-0.3981],[-0.2851,-0.4037],[-0.2957,-0.4089],[-0.306,-0.4145],[-0.3161,-0.4205],[-0.3266,-0.4257],[-0.3371,-0.431],[-0.3475,-0.4364],[-0.3578,-0.442],[-0.3679,-0.448],[-0.3784,-0.4532],[-0.3889,-0.4584],[-0.399,-0.4644],[-0.4085,-0.4713],[-0.4177,-0.4786],[-0.4263,-0.4866],[-0.4344,-0.4952],[-0.4417,-0.5044],[-0.4486,-0.5139],[-0.4547,-0.524],[-0.4597,-0.5346],[-0.4641,-0.5455],[-0.4679,-0.5566],[-0.4704,-0.5681],[-0.4727,-0.5796],[-0.4735,-0.5913],[-0.4735,-0.603],[-0.4735,-0.6148],[-0.4735,-0.6266],[-0.4735,-0.6383],[-0.4735,-0.6501],[-0.4735,-0.6619],[-0.4735,-0.6736],[-0.4735,-0.6854],[-0.4735,-0.6972],[-0.4735,-0.7089],[-0.4735,-0.7207],[-0.4735,-0.7324],[-0.4735,-0.7442],[-0.4735,-0.756],[-0.4735,-0.7677],[-0.4735,-0.7795],[-0.4735,-0.7913],[-0.4735,-0.803],[-0.4735,-0.8148],[-0.4735,-0.8266],[-0.4735,-0.8383],[-0.4735,-0.8501],[-0.4735,-0.8619],[-0.4735,-0.8736],[-0.4735,-0.8854],[-0.4735,-0.8971],[-0.4735,-0.9089],[-0.4735,-0.9207],[-0.4735,-0.9324],[-0.4735,-0.9442],[-0.4718,-0.9555],[-0.461,-0.9528],[-0.4509,-0.9467],[-0.4404,-0.9416],[-0.4303,-0.9355],[-0.42,-0.9299],[-0.4099,-0.9239],[-0.3996,-0.9183],[-0.3891,-0.913],[-0.3789,-0.9071],[-0.3687,-0.9013],[-0.3585,-0.8954],[-0.3483,-0.8896],[-0.3379,-0.8842],[-0.3278,-0.8782],[-0.3175,-0.8726],[-0.3074,-0.8665],[-0.2971,-0.8609],[-0.287,-0.8549],[-0.2767,-0.8493],[-0.2664,-0.8437],[-0.2563,-0.8376],[-0.2462,-0.8316],[-0.2359,-0.826],[-0.2254,-0.8208],[-0.2153,-0.8148],[-0.2052,-0.8087],[-0.1951,-0.8027],[-0.1846,-0.7975],[-0.1745,-0.7915],[-0.1644,-0.7854],[-0.1543,-0.7794],[-0.1438,-0.7742],[-0.1337,-0.7682],[-0.1236,-0.7621],[-0.1135,-0.756],[-0.103,-0.7509],[-0.0929,-0.7448],[-0.0826,-0.7392],[-0.0725,-0.7332],[-0.0622,-0.7275],[-0.0519,-0.722],[-0.0418,-0.7159],[-0.0317,-0.7099],[-0.0214,-0.7042],[-0.0111,-0.6987],[-0.001,-0.6926],[0.0091,-0.6866],[0.0193,-0.6808],[0.0297,-0.6754],[0.0398,-0.6693],[0.0499,-0.6633],[0.0601,-0.6574],[0.0703,-0.6516],[0.0805,-0.6457],[0.0907,-0.64],[0.1009,-0.6341],[0.1111,-0.6283],[0.1213,-0.6224],[0.1315,-0.6167],[0.1416,-0.6107],[0.1521,-0.6055],[0.1622,-0.5994],[0.1723,-0.5934],[0.1824,-0.5873],[0.1927,-0.5817],[0.2028,-0.5757],[0.2129,-0.5696],[0.2232,-0.564],[0.2333,-0.558],[0.2436,-0.5524],[0.2537,-0.5463],[0.2638,-0.5403],[0.2739,-0.5342],[0.284,-0.5282],[0.2943,-0.5226],[0.3044,-0.5165],[0.3144,-0.5104],[0.3245,-0.5044],[0.3344,-0.4981],[0.3444,-0.4919],[0.3547,-0.4863],[0.3646,-0.4798],[0.3746,-0.4738],[0.3847,-0.4677],[0.3948,-0.4616],[0.4046,-0.4552],[0.4144,-0.4487],[0.4242,-0.4422],[0.434,-0.4358],[0.4433,-0.4286],[0.4522,-0.4209],[0.4614,-0.4136],[0.4697,-0.4053],[0.478,-0.397],[0.4864,-0.3886],[0.4939,-0.3797],[0.5014,-0.3706],[0.509,-0.3616],[0.5159,-0.3521],[0.5225,-0.3424],[0.529,-0.3326],[0.5346,-0.3223],[0.5397,-0.3118],[0.5449,-0.3012],[0.5497,-0.2905],[0.554,-0.2796],[0.5578,-0.2685],[0.5606,-0.2571],[0.5629,-0.2456],[0.5647,-0.234],[0.5647,-0.2222],[0.5647,-0.2105],[0.5647,-0.1987],[0.5647,-0.1869],[0.5642,-0.1752],[0.5619,-0.1637],[0.5591,-0.1523],[0.5553,-0.1412],[0.5515,-0.1301],[0.5466,-0.1194],[0.5412,-0.109],[0.5359,-0.0986],[0.5297,-0.0886],[0.5227,-0.0791],[0.5157,-0.0697],[0.5084,-0.0605],[0.5004,-0.0519],[0.4921,-0.0436],[0.4833,-0.0358],[0.4741,-0.0284],[0.4649,-0.0211],[0.4555,-0.0141],[0.4458,-0.0075],[0.4361,-0.0009],[0.4263,0.0057],[0.4165,0.0121],[0.4064,0.0182],[0.3964,0.0243],[0.3867,0.0309],[0.377,0.0375],[0.3672,0.0441],[0.3575,0.0505],[0.3477,0.057],[0.3379,0.0635],[0.3278,0.0695],[0.3179,0.0759],[0.3082,0.0825],[0.2984,0.0889],[0.2883,0.095],[0.2777,0.1001],[0.2669,0.1047],[0.256,0.1091],[0.2449,0.1129],[0.2338,0.1168],[0.2226,0.1199],[0.211,0.1222],[0.1995,0.1245],[0.1878,0.1257],[0.1763,0.1279],[0.1645,0.1279],[0.1528,0.1286]]];

/*GEOM_BEGIN*/
function signedArea(p){
  let s=0;
  for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];s+=a[0]*b[1]-b[0]*a[1];}
  return s/2;
}

// Ear clipping. Espera polígono en sentido antihorario.
function triangulate(poly){
  const n=poly.length;
  const idx=[];for(let i=0;i<n;i++)idx.push(i);
  const tris=[];
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  let guard=0;
  while(idx.length>3){
    if(guard++>n*n*4) throw new Error('triangulación no convergente');
    let found=false;
    for(let i=0;i<idx.length;i++){
      const ia=idx[(i+idx.length-1)%idx.length], ib=idx[i], ic=idx[(i+1)%idx.length];
      const A=poly[ia],B=poly[ib],C=poly[ic];
      if(cross(A,B,C)<=1e-12) continue;
      let inside=false;
      for(const ip of idx){
        if(ip===ia||ip===ib||ip===ic) continue;
        const P=poly[ip];
        if(cross(A,B,P)>=0&&cross(B,C,P)>=0&&cross(C,A,P)>=0){inside=true;break;}
      }
      if(!inside){tris.push([ia,ib,ic]);idx.splice(i,1);found=true;break;}
    }
    if(!found){
      // quitar un vértice colineal (no altera el área) y continuar
      let removed=false;
      for(let i=0;i<idx.length;i++){
        const ia=idx[(i+idx.length-1)%idx.length], ib=idx[i], ic=idx[(i+1)%idx.length];
        if(Math.abs(cross(poly[ia],poly[ib],poly[ic]))<=1e-12){idx.splice(i,1);removed=true;break;}
      }
      if(!removed) throw new Error('polígono no triangulable');
    }
  }
  tris.push([idx[0],idx[1],idx[2]]);
  return tris;
}

// Profundidad por banda. Las bandas cruzan una por delante y otra por detrás:
// la superior avanza en el lado derecho y retrocede en el izquierdo; la inferior, al revés.
function depthAt(band,x,y){
  const s=band===0?1:-1;
  return s*(0.10*Math.tanh(x/0.25)+0.02*y);
}

// Malla extruida: tapa frontal, tapa trasera y paredes laterales.
// Normales por vértice (suavizado): tapas desde el gradiente de profundidad,
// paredes promediando las normales de las aristas adyacentes.
// Formato intercalado: x,y,z,nx,ny,nz (24 bytes por vértice).
function buildBand(poly,band){
  const TH=0.065;
  let p=poly.slice();
  if(signedArea(p)<0) p.reverse();
  const tris=triangulate(p);
  const n=p.length;
  const z=p.map(q=>depthAt(band,q[0],q[1]));
  const e=1e-4;
  const cap=p.map(q=>{
    const gx=(depthAt(band,q[0]+e,q[1])-depthAt(band,q[0]-e,q[1]))/(2*e);
    const gy=(depthAt(band,q[0],q[1]+e)-depthAt(band,q[0],q[1]-e))/(2*e);
    const l=Math.hypot(gx,gy,1);
    return {top:[-gx/l,-gy/l,1/l], bot:[gx/l,gy/l,-1/l]};
  });
  const side=p.map((_,i)=>{
    const a=p[(i+n-1)%n], b=p[i], c=p[(i+1)%n];
    const e1=[b[0]-a[0],b[1]-a[1]], e2=[c[0]-b[0],c[1]-b[1]];
    const n1=[e1[1],-e1[0]], n2=[e2[1],-e2[0]];
    const sx=n1[0]+n2[0], sy=n1[1]+n2[1];
    const l=Math.hypot(sx,sy)||1;
    return [sx/l,sy/l,0];
  });
  const out=[];
  const V=(i,s)=>({p:[p[i][0],p[i][1],z[i]+s*TH], n:s>0?cap[i].top:cap[i].bot});
  const pushV=v=>out.push(v.p[0],v.p[1],v.p[2],v.n[0],v.n[1],v.n[2]);
  for(const [a,b,c] of tris){
    pushV(V(a,1)); pushV(V(b,1)); pushV(V(c,1));
    pushV(V(c,-1)); pushV(V(b,-1)); pushV(V(a,-1));
  }
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    const tI={p:[p[i][0],p[i][1],z[i]+TH], n:side[i]};
    const tJ={p:[p[j][0],p[j][1],z[j]+TH], n:side[j]};
    const bI={p:[p[i][0],p[i][1],z[i]-TH], n:side[i]};
    const bJ={p:[p[j][0],p[j][1],z[j]-TH], n:side[j]};
    pushV(tI); pushV(tJ); pushV(bJ);
    pushV(tI); pushV(bJ); pushV(bI);
  }
  return {data:new Float32Array(out),count:out.length/6};
}
/*GEOM_END*/

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s;}return o;}
function persp(fovy,asp,n,f){const t=1/Math.tan(fovy/2),nf=1/(n-f);return new Float32Array([t/asp,0,0,0, 0,t,0,0, 0,0,(f+n)*nf,-1, 0,0,2*f*n*nf,0]);}
function trans(x,y,z){return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);}
function rotX(a){const c=Math.cos(a),s=Math.sin(a);return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);}
function rotY(a){const c=Math.cos(a),s=Math.sin(a);return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);}

const VS=`
attribute vec3 aPos; attribute vec3 aNor;
uniform mat4 uMVP; uniform mat4 uMV; uniform mat3 uRot;
varying vec3 vN; varying vec3 vV; varying float vZ;
void main(){
  vec4 pv=uMV*vec4(aPos,1.0);
  gl_Position=uMVP*vec4(aPos,1.0);
  vN=uRot*aNor; vV=-pv.xyz; vZ=-pv.z;
}`;
const FS=`
precision mediump float;
varying vec3 vN; varying vec3 vV; varying float vZ;
uniform vec3 uL1; uniform vec3 uL2; uniform vec3 uAlbedo;
uniform vec3 uBlue; uniform vec3 uWhite; uniform vec3 uLight;
void main(){
  vec3 N=normalize(vN), V=normalize(vV);
  if(dot(N,V)<0.0) N=-N;
  vec3 L1=normalize(uL1), L2=normalize(uL2);
  float d1=max(dot(N,L1),0.0), d2=max(dot(N,L2),0.0);
  vec3 H=normalize(L1+V);
  float spec=pow(max(dot(N,H),0.0),60.0);
  float fres=pow(1.0-max(dot(N,V),0.0),3.0);
  vec3 col=uAlbedo*(0.20+0.75*d1)+uBlue*(0.65*d2)+uWhite*(1.1*spec)+uLight*(0.8*fres);
  float fog=smoothstep(2.9,3.9,vZ)*0.35;
  gl_FragColor=vec4(col,1.0);
}`;

function compile(gl,type,src){
  const s=gl.createShader(type);
  gl.shaderSource(s,src); gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)||'shader');
  return s;
}

function init(canvas,opts){
  opts=opts||{};
  const gl=canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true})||canvas.getContext('experimental-webgl',{alpha:true});
  if(!gl) return null;
  const prog=gl.createProgram();
  gl.attachShader(prog,compile(gl,gl.VERTEX_SHADER,VS));
  gl.attachShader(prog,compile(gl,gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog)||'link');
  gl.useProgram(prog);

  const U={};
  ['uMVP','uMV','uRot','uL1','uL2','uAlbedo','uBlue','uWhite','uLight'].forEach(n=>U[n]=gl.getUniformLocation(prog,n));
  const aPos=gl.getAttribLocation(prog,'aPos'), aNor=gl.getAttribLocation(prog,'aNor');
  gl.enableVertexAttribArray(aPos); gl.enableVertexAttribArray(aNor);

  const meshes=SHAPES.map((poly,i)=>{
    const m=buildBand(poly,i);
    const buf=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,m.data,gl.STATIC_DRAW);
    return {buf,count:m.count};
  });

  gl.enable(gl.DEPTH_TEST);
  gl.uniform3f(U.uL1,0.45,0.65,0.75);
  gl.uniform3f(U.uL2,-0.85,-0.25,0.45);
  gl.uniform3f(U.uAlbedo,0.55,0.60,0.70);
  gl.uniform3f(U.uBlue,0.145,0.388,0.922);
  gl.uniform3f(U.uWhite,1,1,1);
  gl.uniform3f(U.uLight,0.376,0.647,0.980);

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let angle=opts.angle||0, tX=0, tY=0, cX=0, cY=0, tS=0, cS=0, raf=0, last=0, visible=true;
  const born=performance.now(); const P={x:0,y:0,zoom:1,ry:0,rx:0,a:1}, T=Object.assign({},P);
  const zoom=opts.zoom||1, tilt=(opts.tilt==null?0.25:opts.tilt), scrollK=opts.scroll||0;

  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const w=Math.max(1,Math.round(canvas.clientWidth*dpr));
    const h=Math.max(1,Math.round(canvas.clientHeight*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  }
  function draw(){
    const w=canvas.width,h=canvas.height;
    gl.viewport(0,0,w,h);
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const dist=Math.max(3.4,0.9/((w/h)*Math.tan(0.375)))/(zoom*P.zoom);
    const model=mul(rotX(tilt+cY+P.rx),mul(rotY(angle+cX+cS+P.ry),trans(0,-0.38,0)));
    const mv=mul(trans(P.x,P.y,-dist),model);
    gl.uniformMatrix4fv(U.uMVP,false,mul(persp(0.75,w/h,0.1,10),mv));
    gl.uniformMatrix4fv(U.uMV,false,mv);
    gl.uniformMatrix3fv(U.uRot,false,new Float32Array([model[0],model[1],model[2],model[4],model[5],model[6],model[8],model[9],model[10]]));
    for(const m of meshes){
      gl.bindBuffer(gl.ARRAY_BUFFER,m.buf);
      gl.vertexAttribPointer(aPos,3,gl.FLOAT,false,24,0);
      gl.vertexAttribPointer(aNor,3,gl.FLOAT,false,24,12);
      gl.drawArrays(gl.TRIANGLES,0,m.count);
    }
  }
  const spin=!reduce&&opts.spin!==false;
  function frame(t){
    const dt=Math.min((t-last)/1000,0.05);
    last=t;
    if(spin) angle+=dt*0.35;
    cX+=(tX-cX)*0.08; cY+=(tY-cY)*0.08; cS+=(tS-cS)*0.07;
    {const kk=1-Math.exp(-dt*3.4); for(const k in P) P[k]+=(T[k]-P[k])*kk;}
    if(opts.stage) canvas.style.opacity=String(P.a*Math.min(1,(t-born)/1400));
    draw();
    canvas.classList.add('is-ready');
    const settled=Math.abs(tX-cX)<1e-3&&Math.abs(tY-cY)<1e-3&&Math.abs(tS-cS)<1e-3&&Object.keys(P).every(k=>Math.abs(T[k]-P[k])<1e-3);
    if(!spin&&settled){raf=0;return;}
    raf=requestAnimationFrame(frame);
  }
  function start(){
    if(raf||!visible||document.hidden) return;
    last=performance.now();
    raf=requestAnimationFrame(frame);
  }
  function stop(){ if(raf){cancelAnimationFrame(raf); raf=0;} }

  const onScroll=()=>{ if(!scrollK||reduce) return; tS=window.scrollY*scrollK; start(); };
  const onPointer=e=>{
    if(opts.pointer===false||e.pointerType!=='mouse') return;
    const r=canvas.getBoundingClientRect();
    tX=clamp(((e.clientX-(r.left+r.width/2))/window.innerWidth)*0.6,-0.3,0.3);
    tY=clamp(((e.clientY-(r.top+r.height/2))/window.innerHeight)*0.4,-0.2,0.2);
    start();
  };
  const onResize=()=>{resize(); start();};
  const onVis=()=>{document.hidden?stop():start();};
  const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting; visible?start():stop();});
  const onLost=e=>{e.preventDefault(); stop(); canvas.dispatchEvent(new CustomEvent('symbol-fallback'));};

  window.addEventListener('pointermove',onPointer,{passive:true});
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onResize);
  document.addEventListener('visibilitychange',onVis);
  canvas.addEventListener('webglcontextlost',onLost);
  io.observe(canvas);
  resize();
  start();

  return {
    pose(p){Object.assign(T,p);start();},
    destroy(){
      stop(); io.disconnect();
      window.removeEventListener('pointermove',onPointer);
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',onResize);
      document.removeEventListener('visibilitychange',onVis);
    }
  };
}

window.NieblaSymbol={init};
})();
