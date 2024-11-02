import {
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  createContext,
} from 'react';

type AnimationStateType =
  | 'form-scanEnter'
  | 'form-manageEnterBack'
  | 'form-manageLeave'
  | 'form-scanLeaveBack'
  | 'scanEnterBack-spaceLeaveBack'
  | 'scanLeave-spaceEnter'
  | 'spaceEnterBack-manageLeaveback'
  | 'spaceLeave-manageEnter';
// | 'formEnter' // = scanEnter
// | 'formEnterBack' // = manageEnterBack
// | 'formLeave' // = manageLeave
// | 'formLeaveBack' // = scanLeaveBack
// | 'scanEnter' // = formEnter
// | 'scanEnterBack' // = spaceLeaveBack
// | 'scanLeave' // = spaceEnter
// | 'scanLeaveBack' // = formLeaveBack
// | 'spaceEnter' // = scanLeave
// | 'spaceEnterBack' // = manageLeaveback
// | 'spaceLeave' // = manageEnter
// | 'spaceLeaveBack' // = scanEnterBack
// | 'manageEnter' // = spaceLeave
// | 'manageEnterBack' // = formEnterBack
// | 'manageLeave' // = formLeave
// | 'manageLeaveBack'; // = spaceEnterBack

type AnimationContextType = {
  animationState: AnimationStateType;
  setAnimationState: Dispatch<SetStateAction<AnimationStateType>>;
};

type AnimationContextProviderProps = {
  children: React.ReactNode;
};

const AnimationContext = createContext<AnimationContextType | null>(null);

export const AnimationContextProvider = ({
  children,
}: AnimationContextProviderProps) => {
  const [animationState, setAnimationState] =
    useState<AnimationStateType>('form-scanLeaveBack');

  return (
    <AnimationContext.Provider value={{ animationState, setAnimationState }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error('useMediaQuery must be used within a MediaQueryProvider');
  }

  return context;
};
