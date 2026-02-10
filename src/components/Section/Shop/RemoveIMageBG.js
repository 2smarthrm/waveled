 export default function RemoveIMageBG(target, color = 'red') {
  let elements = [];
 
  if (typeof target === 'string') {
    elements = document.querySelectorAll(target);
  } else if (target instanceof HTMLElement) {
    elements = [target];
  }

  elements.forEach(img => {
    if (!(img instanceof HTMLImageElement)) return;
 
    const wrapper = document.createElement('div');
    wrapper.style.width = img.width + 'px';
    wrapper.style.height = img.height + 'px';
    wrapper.style.backgroundColor = color;

    wrapper.style.webkitMaskImage = `url(${img.src})`;
    wrapper.style.webkitMaskRepeat = 'no-repeat';
    wrapper.style.webkitMaskSize = 'contain';
    wrapper.style.webkitMaskPosition = 'center';

    wrapper.style.maskImage = `url(${img.src})`;
    wrapper.style.maskRepeat = 'no-repeat';
    wrapper.style.maskSize = 'contain';
    wrapper.style.maskPosition = 'center';

 
    wrapper.style.display = 'inline-block'; 
    img.parentNode.replaceChild(wrapper, img);
  });
}
