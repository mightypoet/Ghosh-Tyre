'use client';

import React, {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'motion/react';
import { cn } from '../../lib/utils';

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;

export type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  staticLayout?: boolean;
};

export type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  onMouseEnter?: (e?: React.MouseEvent) => void;
  onMouseLeave?: (e?: React.MouseEvent) => void;
  'aria-label'?: string;
};

export type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};

export type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DocContextType = {
  mouseX: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
  staticLayout: boolean;
};

type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within an DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
  staticLayout = true,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const dynamicHeight = useSpring(heightRow, spring);

  return (
    <div
      style={{
        height: panelHeight,
      }}
      className="mx-1 flex max-w-full items-center overflow-visible"
    >
      <div
        onMouseMove={
          staticLayout
            ? undefined
            : ({ pageX }) => {
                isHovered.set(1);
                mouseX.set(pageX);
              }
        }
        onMouseLeave={
          staticLayout
            ? undefined
            : () => {
                isHovered.set(0);
                mouseX.set(Infinity);
              }
        }
        className={cn(
          'mx-auto flex w-fit items-center gap-3.5 rounded-2xl bg-[#1C1D24]/90 px-3.5 border border-white/10 dark:bg-neutral-900',
          className
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider
          value={{ mouseX, spring, distance, magnification, staticLayout }}
        >
          {children}
        </DockProvider>
      </div>
    </div>
  );
}

function DockItem({
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  'aria-label': ariaLabel,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { staticLayout, distance, magnification, mouseX, spring } = useDock();

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={staticLayout ? undefined : { width }}
      whileHover={{
        scale: 1.14,
        y: -2,
        transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.6 },
      }}
      whileTap={{
        scale: 0.94,
        transition: { type: 'spring', stiffness: 500, damping: 30 },
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn(
        'relative inline-flex items-center justify-center cursor-pointer select-none',
        staticLayout ? 'w-10 h-10 shrink-0' : '',
        className
      )}
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<any>, {
              width: staticLayout ? undefined : width,
              isHovered,
            })
          : child
      )}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps['isHovered'] as MotionValue<number> | undefined;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute -top-7 left-1/2 w-fit whitespace-pre rounded-md border border-white/15 bg-[#1C1D24] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-2xl pointer-events-none z-50',
            className
          )}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const width = restProps['width'] as MotionValue<number> | undefined;

  const widthTransform = useTransform(width ?? new MotionValue(40), (val) => val / 2);

  return (
    <motion.div
      style={width ? { width: widthTransform } : undefined}
      className={cn('flex items-center justify-center', className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
