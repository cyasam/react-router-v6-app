import { useEffect, useRef } from 'react';
import { useNavigation } from 'react-router-dom';
import type { LoadingBarRef } from 'react-top-loading-bar';
import LoadingBar from 'react-top-loading-bar';

export default function NavigationProgress() {
  const navigation = useNavigation();
  const ref = useRef<LoadingBarRef>(null);

  const isLoading =
    navigation.state === 'loading' || navigation.state === 'submitting';
  const idle = navigation.state === 'idle';

  useEffect(() => {
    if (isLoading) {
      ref.current?.continuousStart();
    }

    if (idle) {
      ref.current?.complete();
    }
  }, [isLoading, idle]);

  return (
    <LoadingBar
      ref={ref}
      color="#d1541a"
      shadow={false}
      height={3}
      transitionTime={100}
      waitingTime={300}
    />
  );
}
