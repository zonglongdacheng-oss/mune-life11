export const STAT_KEYS=["BODY","FREEDOM","CHALLENGE","EXPRESSION","CONNECTION","SELF_RELIANCE","CHARACTER","LIFE_EXPERIENCE"] as const;
export type StatKey=typeof STAT_KEYS[number];
export const STAT_LABEL:Record<StatKey,string>={BODY:"BODY",FREEDOM:"FREEDOM",CHALLENGE:"CHALLENGE",EXPRESSION:"EXPRESSION",CONNECTION:"CONNECTION",SELF_RELIANCE:"SELF RELIANCE",CHARACTER:"CHARACTER",LIFE_EXPERIENCE:"LIFE EXPERIENCE"};
export const rank=(x:number)=>x>=80?"S":x>=70?"A":x>=60?"B":x>=50?"C":x>=40?"D":x>=30?"E":x>=20?"F":"G";
export const rankNext=(x:number)=>x>=80?100:x>=70?80:x>=60?70:x>=50?60:x>=40?50:x>=30?40:x>=20?30:20;
export const level=(stats:Record<string,number>)=>Math.min(100,Math.floor(Object.values(stats).reduce((a,b)=>a+b,0)/7)+1);
export const levelTitle=(l:number)=>l>=90?"自分の生き方が人に影響を与える":l>=80?"人生そのものがコンテンツになる":l>=70?"時間と場所の自由が増える":l>=60?"自分の活動が仕事につながる":l>=50?"人とのつながりが広がる":l>=40?"自分の世界観が形成される":l>=30?"挑戦が日常になる":l>=20?"自分の得意分野が見えてくる":l>=10?"習慣が形成され始める":"人生の主人公になる";
export const DEFAULT_STATS:Record<StatKey,number>={BODY:56,FREEDOM:43,CHALLENGE:38,EXPRESSION:43,CONNECTION:34,SELF_RELIANCE:48,CHARACTER:51,LIFE_EXPERIENCE:31};
