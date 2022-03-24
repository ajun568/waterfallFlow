import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from './config';

const pageSize = 100;
const baseHeight = 200;
const gap = 10;
const baseUrl = BASE_URL[process.env.REACT_APP_ENV];

const WaterfallFlow = () => {
  const [list, setList] = useState([]); // 数据
  const [loaded, setLoaded] = useState(0); // 已加载数量
  const [pageNum, setPageNum] = useState(0); // 页数
  const [loading, setLoading] = useState(false); // Loading
  const [finish, setFinish] = useState(false); // 加载情况
  const itemRefs = useRef({});

  useEffect(() => {
    window.addEventListener('scroll', lazyLoad);

    return () => {
      window.removeEventListener('scroll', lazyLoad);
    };
  })

  useEffect(() => {
    getList();
  }, [])

  useEffect(() => {
    lazyLoad('init');
  }, [list])

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

  const getWidth = (width, height) => {
    const ratio = width / height;
    return ~~(baseHeight * ratio);
  }

  const lazyLoad = (init) => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const winHeight = window.innerHeight;
    let flag = loaded;

    for (let i = loaded; i < list.length; i++) {
      const info = list[i];
      const itemNode = itemRefs.current[info.id];
      if (itemNode.offsetTop < scrollTop + winHeight) {
        flag = i;
        const imageNode = itemNode.childNodes[0];
        const url = imageNode.getAttribute('data-src');
        const image = new Image();
        image.src = url;
        image.onload = function() {
          imageNode.src = url;
          imageNode.alt = info.title;
        }
      }
    }

    if (init !== 'init' && document.body.offsetHeight - scrollTop < 1.5 * winHeight) { 
      getList();
    }

    setLoaded(flag);
  }

  return (
    <section style={{padding: `${gap / 2}px`}}>
      <div className="flex-wrapper" >
      {
        list.map(item => (
          <div
            key={item.id}
            ref={r => { itemRefs.current[item.id] = r }}
            className="flex-item"
            style={{
              width: `${getWidth(item.width, item.height)}px`,
              height: `${baseHeight}px`,
              margin: `${gap / 2}px`
            }}
          >
            <img
              data-src={item.image_url}
              alt=""
              style={{height: `${baseHeight}px`}}
            />
          </div>
        ))
      }
      </div>
      { loading && <div className="loading">Loading...</div> }
      { finish && <div className="loading">--- End ---</div> }
    </section>
  )
}

export default WaterfallFlow;
