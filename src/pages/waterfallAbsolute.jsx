import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from './config';

const pageSize = 100;
const baseWidth = 150;
const gap = 10;
const baseUrl = BASE_URL[process.env.REACT_APP_ENV];

const WaterfallFlowAbsolute = () => {
  const [itemWidth, setItemWidth] = useState(baseWidth); // item宽度
  const [list, setList] = useState([]); // 数据
  const [renderDom, setRenderDom] = useState(0); // 已生成的dom数量
  const [heightsArr, setHeightsArr] = useState([]); // 列高数组
  const [pageNum, setPageNum] = useState(0); // 页数
  const [loading, setLoading] = useState(false); // Loading
  const [finish, setFinish] = useState(false); // 加载情况
  const loaded = useRef(0); // 已加载数量
  const wrapperRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    window.addEventListener('scroll', lazyLoad);
    // window.addEventListener('resize', debounce(resize, 500));

    return () => {
      window.removeEventListener('scroll', lazyLoad);
      // window.removeEventListener('resize', debounce(resize, 500));
    };
  })

  useEffect(() => {
    getItemWidth();
    getList();
  }, [])

  useEffect(() => {
    if (!list.length) return;
    waterfall();
    lazyLoad();
  }, [list])

  /** 计算规则 - 模拟 Grid -- minmax()
    n * (baseWidth + x) + (n + 1) * gap = width
    n -> 正整数
    x >= 0 & x < baseWidth
    在符合条件的基础上，让n最大化
  */
  const getItemWidth = () => {
    const width = document.body.offsetWidth;
    const getRemainWidth = n => (width - gap - n * (gap + baseWidth)) / n;
    let remainWidth = 0;
    let cols = 1;

    while (cols) {
      let rw = getRemainWidth(cols);
      if (rw > width) {
        cols += 1;
      } else if (rw < 0) {
        break;
      } else {
        cols += 1;
        remainWidth = rw;
      }
    }

    setItemWidth(remainWidth + baseWidth);
  }

  const getList = async () => {
    if (loading) return;

    setLoading(true);
    const data = await fetch(`${baseUrl}/api/image/list?pageSize=${pageSize}&pageNum=${pageNum}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
    setLoading(false);

    if (data.err_no !== 0) return;
    
    if (!data.data.length) {
      setFinish(true);
      return;
    }

    setPageNum(page => page + 1);
    setList(list => list.concat(data.data));
  }

  const getCols = () => { // n * itemWidth + (n + 1) * gap = bodyWidth
    return ~~((document.body.offsetWidth - gap) / (itemWidth + gap));
  }

  const getHeight = (width, height) => {
    const ratio = width / height;
    return ~~(itemWidth / ratio);
  }

  const waterfall = () => {
    const cols = getCols();
    const heights = heightsArr;

    for (let i = renderDom; i < list.length; i++) {
      const item = list[i];
      const itemNode = itemRefs.current[item.id];
      const height = itemNode.offsetHeight;

      if (i < cols) {
        itemNode.style.top = `${gap}px`;;
        itemNode.style.left = `${gap + i * (itemWidth + gap)}px`;
        heights.push(height + gap);
      } else {
        const min = Math.min(...heights);
        const minIndex = heights.indexOf(min);
        const top = min + gap;

        itemNode.style.top = `${top}px`;
        itemNode.style.left = `${gap + minIndex * (itemWidth + gap)}px`;
        heights[minIndex] = top + height;
      }
    }

    setRenderDom(list.length);
    setHeightsArr(heights);
  }

  const lazyLoad = () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const winHeight = window.innerHeight;
    let flag = loaded.current;
    
    for (let i = loaded.current; i < list.length; i++) {
      const info = list[i];
      const itemNode = itemRefs.current[info.id];
      if (itemNode.offsetTop < scrollTop + winHeight) {
        flag = i;
        const imageNode = itemNode.childNodes[0];
        if (imageNode.getAttribute('loaded') === 'true') continue;

        imageNode.setAttribute('loaded', true);
        const url = imageNode.getAttribute('data-src');
        imageNode.src = url;
        imageNode.alt = info.title;
      }
    }

    if (Math.max(...heightsArr) - scrollTop < 1.5 * winHeight) { 
      getList();
    }

    loaded.current = flag;
  }

  const dealErrImage = (e) => {
    e.target.setAttribute('loaded', false);
    e.target.alt = '';
    e.target.removeAttribute('src');
  }

  const debounce = (fn, delay = 0) => {
    let timer = null;
    return function() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { fn() }, delay);
    }
  }

  const resize = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    window.location.reload();
  }

  return (
    <section
      ref={wrapperRef}
      className="ab-wrapper"
    >
      <div style={{height: `${Math.max(...heightsArr)}px`}}>
      {
        list.map(item => 
          <div
            key={item.id}
            ref={r => { itemRefs.current[item.id] = r }}
            className="ab-item"
            style={{height: `${getHeight(item.width, item.height)}px`, width: `${itemWidth}px`}}
          >
            <img
              data-src={item.image_url}
              alt=""
              onError={dealErrImage}
            />
          </div>
        )
      }
      </div>
      { loading && <div className="loading">Loading...</div> }
      { finish && <div className="loading">--- End ---</div> }
    </section>
  )
}

export default WaterfallFlowAbsolute;
