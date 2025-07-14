import { useState } from 'react';
import './App.css';

const BASE_SCORE = 10;

interface HuType {
  name: string;
  multiplier: number;
  desc: string;
  mingGangType?: '点杠' | '自杠'; // 仅明杠用
}

interface HuTypeWithCount extends HuType {
  count?: number; // 点杠/暗杠次数
}

const HU_TYPES: HuType[] = [
  { name: "自摸", multiplier: 2, desc: "自己摸到胡牌" },
  { name: "点炮", multiplier: 1, desc: "别人打出胡牌" },
  { name: "清一色", multiplier: 4, desc: "全部同一花色" },
  { name: "碰碰胡", multiplier: 2, desc: "全部是刻子" },
  { name: "七对", multiplier: 4, desc: "7个对子" },
  { name: "杠上开花", multiplier: 2, desc: "杠后摸牌胡" },
  { name: "海底捞月", multiplier: 2, desc: "摸最后一张胡" },
  { name: "抢杠胡", multiplier: 2, desc: "抢别人加杠胡" },
  { name: "混一色", multiplier: 2, desc: "一种花色+字牌" },
  { name: "带幺九", multiplier: 2, desc: "每组都有1或9" },
  { name: "门清", multiplier: 2, desc: "没有碰过牌" },
  { name: "明杠", multiplier: 2, desc: "明杠-点杠：他人打出自己杠，只收一家的钱", mingGangType: '点杠' },
  { name: "明杠", multiplier: 2, desc: "明杠-自杠：自己摸牌后杠，三家都要给钱", mingGangType: '自杠' },
  { name: "暗杠", multiplier: 4, desc: "暗杠得分，三家都要给钱" }
];

function getRandomHuTypes(): HuTypeWithCount[] {
  // 随机生成1~3种胡牌类型组合，且不重复
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...HU_TYPES].sort(() => 0.5 - Math.random());
  let result: HuTypeWithCount[] = [];
  let hasMingGang = false;
  let hasAnGang = false;
  for (let i = 0; i < shuffled.length && result.length < count; i++) {
    const t = shuffled[i];
    if (t.name === '明杠' && hasMingGang) continue;
    if (t.name === '明杠') {
      hasMingGang = true;
      // 只允许点杠出现多次，自杠只出现一次
      if (t.mingGangType === '点杠') {
        const gangCount = Math.floor(Math.random() * 2) + 1; // 1~2次
        result.push({ ...t, count: gangCount });
      } else {
        result.push({ ...t, count: 1 });
      }
      continue;
    }
    if (t.name === '暗杠') {
      if (hasAnGang) continue;
      hasAnGang = true;
      const gangCount = Math.floor(Math.random() * 2) + 1; // 1~2次
      result.push({ ...t, count: gangCount });
      continue;
    }
    result.push({ ...t });
  }
  return result;
}

function calcScore(types: HuTypeWithCount[]): number {
  // 先算点炮/自摸等主胡分（如点炮*3），再加所有杠分
  let total = 0;
  let mainType = types.find(t => t.name === '点炮' || t.name === '自摸');
  if (mainType) {
    // 主胡分：如点炮*3家，自摸*3家
    total += BASE_SCORE * mainType.multiplier * 3;
  }
  // 其他类型（如清一色、碰碰胡等）叠加到主胡分
  types.forEach(t => {
    if (t === mainType) return;
    if (t.name === '明杠' && t.mingGangType === '点杠') {
      // 点杠每次只收一家的钱
      total += BASE_SCORE * t.multiplier * (t.count || 1);
    } else if (t.name === '暗杠') {
      // 暗杠每次收三家
      total += BASE_SCORE * t.multiplier * (t.count || 1) * 3;
    } else if (t.name === '明杠' && t.mingGangType === '自杠') {
      // 明杠自杠只出现一次，三家都要给钱
      total += BASE_SCORE * t.multiplier * 3;
    } else if (t.name !== '点炮' && t.name !== '自摸') {
      // 其他类型倍数叠加到主胡分
      if (mainType) {
        total += BASE_SCORE * mainType.multiplier * 3 * (t.multiplier - 1);
      } else {
        total += BASE_SCORE * t.multiplier * 3;
      }
    }
  });
  return total;
}

function calcFormula(types: HuTypeWithCount[]): string {
  let mainType = types.find(t => t.name === '点炮' || t.name === '自摸');
  let formulaArr: string[] = [];
  if (mainType) {
    formulaArr.push(`${BASE_SCORE}×${mainType.multiplier}×3`);
  }
  types.forEach(t => {
    if (t === mainType) return;
    if (t.name === '明杠' && t.mingGangType === '点杠') {
      formulaArr.push(`${BASE_SCORE}×${t.multiplier}×${t.count || 1}`);
    } else if (t.name === '暗杠') {
      formulaArr.push(`${BASE_SCORE}×${t.multiplier}×${t.count || 1}×3`);
    } else if (t.name === '明杠' && t.mingGangType === '自杠') {
      formulaArr.push(`${BASE_SCORE}×${t.multiplier}×3`);
    } else if (t.name !== '点炮' && t.name !== '自摸') {
      if (mainType) {
        formulaArr.push(`${BASE_SCORE}×${mainType.multiplier}×3×${t.multiplier - 1}`);
      } else {
        formulaArr.push(`${BASE_SCORE}×${t.multiplier}×3`);
      }
    }
  });
  return formulaArr.join(' + ');
}

function App() {
  // 规则说明/练习区切换
  const [showRule, setShowRule] = useState(true);
  // 当前题目
  const [huTypes, setHuTypes] = useState<HuTypeWithCount[]>(getRandomHuTypes());
  // 用户输入
  const [input, setInput] = useState('');
  // 答案反馈
  const [result, setResult] = useState<null | boolean>(null); // null | true | false
  // 答题统计
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);

  const answer = calcScore(huTypes);
  const formula = calcFormula(huTypes);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTotal(total + 1);
    if (Number(input) === answer) {
      setResult(true);
      setCorrect(correct + 1);
    } else {
      setResult(false);
    }
  };

  const handleNext = () => {
    setHuTypes(getRandomHuTypes());
    setInput('');
    setResult(null);
  };

  // 新增：仅刷新胡牌类型，不重置答题统计
  const handleRefreshTypes = () => {
    setHuTypes(getRandomHuTypes());
    setInput('');
    setResult(null);
  };

  // 统计点杠、暗杠次数
  const dianGang = huTypes.find(t => t.name === '明杠' && t.mingGangType === '点杠');
  const anGang = huTypes.find(t => t.name === '暗杠');

  return (
    <div className="container">
      <h1>川麻胡牌计分练习</h1>
      <div className="nav">
        <button onClick={() => setShowRule(true)} className={showRule ? 'active' : ''}>计分规则说明</button>
        <button onClick={() => setShowRule(false)} className={!showRule ? 'active' : ''}>开始练习</button>
      </div>
      {showRule ? (
        <div className="rule-panel">
          <h2>计分规则</h2>
          <p>底分：<b>10分</b></p>
          <table>
            <thead>
              <tr>
                <th>胡牌类型</th>
                <th>倍数</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {HU_TYPES.map((type, idx) => (
                <tr key={type.name + idx}>
                  <td>{type.name}{type.mingGangType ? `（${type.mingGangType}）` : ''}</td>
                  <td>×{type.multiplier}</td>
                  <td>{type.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{marginTop:8}}>多种胡牌类型可叠加倍数。例如：清一色+自摸=10×4×2=80分。点杠、暗杠可多次出现，点杠每次收一家的钱，暗杠每次收三家。</p>
        </div>
      ) : (
        <div className="practice-panel">
          <h2>练习区</h2>
          <div className="question">
            <div>底分：<b>{BASE_SCORE}</b> 分</div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span>胡牌类型：</span>
              {huTypes.map((t, idx) => (
                <>
                  <span className="hu-tag" key={t.name + (t.mingGangType||'')}>{t.name}{t.mingGangType ? `（${t.mingGangType}）` : ''}{(t.count && (t.name==='明杠'||t.name==='暗杠')) ? `×${t.count}` : ''}</span>
                  {idx !== huTypes.length - 1 && <span style={{color:'#1677ff',fontWeight:700,margin:'0 4px'}}>+</span>}
                </>
              ))}
              <button className="refresh-btn" onClick={handleRefreshTypes} title="换一组胡牌类型" style={{marginLeft:8,padding:'2px 10px',borderRadius:6,border:'1.5px solid #b3d2ff',background:'#f5f7fa',color:'#1677ff',cursor:'pointer',fontSize:15}}>刷新</button>
            </div>
            <div style={{marginTop:8, color:'#1677ff', fontSize:15}}>
              {dianGang && <span>点杠次数：{dianGang.count || 1} </span>}
              {anGang && <span style={{marginLeft:12}}>暗杠次数：{anGang.count || 1}</span>}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="answer-form">
            <label>
              请输入你计算的得分：
              <input
                type="number"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={result === true}
                required
                min={0}
              />
            </label>
            <button type="submit" disabled={result === true}>确定</button>
          </form>
          {result !== null && (
            <div className="result-feedback">
              {result ? (
                <div className="right"><span>✔</span> 恭喜，答对了！</div>
              ) : (
                <div className="wrong">
                  <span>✘</span> 计算错误！<br/>
                  正确答案：<b>{answer}</b> 分<br/>
                  计算方法：{formula} = <b>{answer}</b>
                </div>
              )}
              <button onClick={handleNext}>再来一题</button>
            </div>
          )}
          <div className="stat">
            已答题：{total}，答对：{correct}，正确率：{total ? ((correct/total)*100).toFixed(1) : 0}%
          </div>
        </div>
      )}
      <footer style={{marginTop:32, color:'#888', fontSize:14}}>
        © 川麻计分练习 | 仅供学习娱乐
      </footer>
    </div>
  );
}

export default App;
