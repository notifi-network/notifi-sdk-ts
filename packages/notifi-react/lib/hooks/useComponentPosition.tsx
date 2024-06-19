import React from 'react';

export enum ComponentPosition {
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
}

export const useComponentPosition = (
  componentRef: React.RefObject<HTMLDivElement>,
  parentComponentRelativeClassName: string,
) => {
  const [componentPosition, setComponentPosition] =
    React.useState<ComponentPosition>(ComponentPosition.TopLeft);
  React.useEffect(() => {
    const targetListContainer = document.getElementsByClassName(
      parentComponentRelativeClassName,
    )?.[0];
    if (!targetListContainer) return;
    const handleScroll = () => {
      if (!componentRef.current) return;
      const tooltipIconRect = componentRef.current.getBoundingClientRect();
      const targetListContainerRect =
        targetListContainer.getBoundingClientRect();
      const tooltipIconFromTop =
        tooltipIconRect.top - targetListContainerRect?.top;
      const tooltipIconFromLeft =
        tooltipIconRect.left - targetListContainerRect?.left;
      const contianerMiddlePositionX = targetListContainerRect?.width / 2;
      const containerMiddlePositionY = targetListContainerRect?.height / 2;
      setComponentPosition(() => {
        if (tooltipIconFromTop > containerMiddlePositionY) {
          return tooltipIconFromLeft > contianerMiddlePositionX
            ? ComponentPosition.BottomRight
            : ComponentPosition.BottomLeft;
        }
        return tooltipIconFromLeft > contianerMiddlePositionX
          ? ComponentPosition.TopRight
          : ComponentPosition.TopLeft;
      });
    };
    handleScroll();
    targetListContainer.addEventListener('scroll', handleScroll);
    return () =>
      targetListContainer.removeEventListener('scroll', handleScroll);
  }, [componentRef.current]);
  return {
    componentPosition,
  };
};
