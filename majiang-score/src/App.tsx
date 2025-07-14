import { useState } from 'react';
import './App.css';

const BASE_SCORE = 10;

interface HuType {
  name: string;
  multiplier: number;
  desc: string;
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
  { name: "明杠", multiplier: 2, desc: "明杠得分" },
  { name: "暗杠", multiplier: 4, desc: "暗杠得分" }
];

function getRandomHuTypes(): HuType[] {
  // 随机生成1~3种胡牌类型组合，且不重复
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...HU_TYPES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function calcScore(types: HuType[]): number {
  return types.reduce((score, t) => score * t.multiplier, BASE_SCORE);
}

function calcFormula(types: HuType[]): string {
  return [BASE_SCORE, ...types.map(t => t.multiplier)].join(' × ');
}

function App() {
  // 规则说明/练习区切换
  const [showRule, setShowRule] = useState(true);
  // 当前题目
  const [huTypes, setHuTypes] = useState<HuType[]>(getRandomHuTypes());
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
              {HU_TYPES.map(type => (
                <tr key={type.name}>
                  <td>{type.name}</td>
                  <td>×{type.multiplier}</td>
                  <td>{type.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{marginTop:8}}>多种胡牌类型可叠加倍数。例如：清一色+自摸=10×4×2=80分</p>
        </div>
      ) : (
        <div className="practice-panel">
          <h2>练习区</h2>
          <div className="question">
            <div>底分：<b>{BASE_SCORE}</b> 分</div>
            <div>胡牌类型：
              {huTypes.map((t, idx) => (
                <>
                  <span className="hu-tag" key={t.name}>{t.name}</span>
                  {idx !== huTypes.length - 1 && <span style={{color:'#1677ff',fontWeight:700,margin:'0 4px'}}>+</span>}
                </>
              ))}
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
