import React, { useEffect, useRef } from 'react';
import data from '../data.json';

const WaterfallFlow = () => {
  const imgsRef = useRef(null);

  useEffect(() => {
    window.addEventListener('resize', computedWrapper);
    window.addEventListener('scroll', lazyLoad);

    return () => {
      window.removeEventListener('resize', computedWrapper);
      window.removeEventListener('scroll', lazyLoad);
    };
  })

  useEffect(() => {
    computedWrapper();
  }, [imgsRef])

  const computedWrapper = () => {
    if (!imgsRef.current) return;
    let flag = 0;
    imgsRef.current.childNodes.forEach((item, index) => {
      const imgNode = item.childNodes[0];
      const url = imgNode.getAttribute('data-src');
      const imageWidth = imgNode.getAttribute('imgWidth');
      const imgHeight = imgNode.getAttribute('imgHeight');
      const width = item.offsetWidth;

      if (!imageWidth || !imgHeight) {
        const image = new Image();
        image.src = url;
        image.onload = function() {
          const w = image.width;
          const h = image.height;
          imgNode.setAttribute('imgWidth', w);
          imgNode.setAttribute('imgHeight', h);
          const height = h * width / w;
          item.style.height = `${~~(height + 10)}px`;
          imgNode.style.height = `${~~(height)}px`;
          imgNode.classList.add('virtal-img');
          item.style.gridRowEnd = `span ${~~(height + 10)}`;
          flag += 1;

          if (flag === imgsRef.current.childNodes.length - 1) {
            lazyLoad();
          }
        }
      } else {
        const height = imgHeight * width / imageWidth;
        imgNode.style.height = `${~~(height)}px`;
        item.style.gridRowEnd = `span ${~~(height + 10)}`;
      }
    })
  }

  const lazyLoad = () => {
    if (!imgsRef.current) return;
    const itemNodes = imgsRef.current.childNodes;
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const winHeight = window.innerHeight;
    for (let i = 0; i < itemNodes.length; i++) {
      
      const imgNode = itemNodes[i].childNodes[0];
      if (imgNode.offsetTop < scrollTop + winHeight) {
        imgNode.src = imgNode.getAttribute('data-src');
      }
    }
  }

  return (
    <section
      className="wrapper"
      ref={imgsRef}
    >
      {
        data.map(item => 
          <div
            className="item"
            key={item.id}
          >
            <img data-src={item.img} />
          </div>
        )
      }
    </section>
  )
}

export default WaterfallFlow;
