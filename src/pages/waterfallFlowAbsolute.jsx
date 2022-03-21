import React, { useState, useEffect, useRef } from 'react';

const pageSize = 100;
const itemWidth = 100;
const gap = 10;
const baseUrl = 'http://localhost:3010';

const WaterfallFlowAbsolute = () => {
  const [list, setList] = useState([]); // 数据
  const [render, setRender] = useState(0); // 已生成的dom数量
  const [loaded, setLoaded] = useState(0); // 已加载数量
  const [total, setTotal] = useState(0); // 总数量
  const [heightWidthArr, setHeightWidthArr] = useState([]); // 列高数组
  const [pageNum, setPageNum] = useState(0); // 页数
  const wrapperRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    getList();
  }, [])

  useEffect(() => {
    waterfall()
  }, [list])

  const getList = async () => {
    const data = await fetch(`${baseUrl}/api/image/list?pageSize=${pageSize}&pageNum=${pageNum}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (data.err_no !== 0) return;

    setList(data.data);
    setPageNum(page => page + 1);
  }

  const getCols = () => { // n * itemWidth + (n + 1) * gap = bodyWidth
    return ~~((document.body.offsetWidth - gap) / (itemWidth + gap));
  }

  const getHeight = (width, height) => {
    const ratio = width / height;
    return itemWidth / ratio;
  }

  const waterfall = () => {
    for (let i = loaded; i < list.length; i++) {
      const item = list[i];
      console.log(itemRefs.current[item.id]);
    }
  }

  return (
    <section
      ref={wrapperRef}
      className="ab-wrapper"
    >
      {
        list.map(item => 
          <div
            key={item.id}
            ref={r => { itemRefs.current[item.id] = r }}
            className="ab-item"
            style={{height: `${getHeight(item.width, item.height)}px`}}
          >
            <img data-src={item.image_url} alt="" />
          </div>
        )
      }
    </section>
  )
}

export default WaterfallFlowAbsolute;
