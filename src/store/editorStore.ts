import { create } from 'zustand';
import { generateRandomGradient } from '../utils/gradientGenerator';
import { generateRandomPattern } from '../utils/patternGenerator';
import { PAPERS } from '../config/constants';

interface TextStyle {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  fontFamily: string;
  fontSize: number;
  textColor: string;
}

interface TextBox {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: TextStyle;
}

interface EditorState {
  isSimpleMode: boolean;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  textStyle: {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
  };
  backgroundType: 'gradient' | 'paper' | 'color' | 'pattern';
  backgroundColor: string;
  backgroundValue: string;
  isPanelDocked: boolean;
  patternUrl: string | null;
  setPatternUrl: (url: string) => void;
  textBoxes: TextBox[];
  selectedTextBoxId: string | null;
  overlays: Array<{
    id: string;
    type: 'text' | 'image';
    content: string;
    position: { x: number; y: number };
  }>;
  setSimpleMode: (isSimple: boolean) => void;
  setFont: (font: string) => void;
  setFontSize: (size: number) => void;
  setTextColor: (color: string) => void;
  setTextStyle: (style: Partial<typeof initialTextStyle>) => void;
  setBackground: (type: 'gradient' | 'paper' | 'color' | 'pattern', value: string) => void;
  setBackgroundColor: (color: string) => void;
  setPanelDocked: (isDocked: boolean) => void;
  regeneratePattern: () => void;
  addTextBox: () => void;
  updateTextBox: (id: string, updates: Partial<TextBox>) => void;
  removeTextBox: (id: string) => void;
  setSelectedTextBox: (id: string | null) => void;
  updateSelectedTextBoxStyle: (style: Partial<TextStyle>) => void;
  addOverlay: (overlay: Omit<EditorState['overlays'][0], 'id'>) => void;
  updateOverlayPosition: (id: string, position: { x: number; y: number }) => void;
  updateOverlayContent: (id: string, content: string) => void;
  removeOverlay: (id: string) => void;
}

const initialTextStyle = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  fontFamily: 'Inter',
  fontSize: 16,
  textColor: '#000000'
};

const GRID_SIZE = 220;
const INITIAL_OFFSET = 40;

export const useEditorStore = create<EditorState>((set, get) => ({
  isSimpleMode: false,
  fontFamily: 'Inter',
  fontSize: 16,
  textColor: '#000000',
  textStyle: {
    isBold: false,
    isItalic: false,
    isUnderline: false
  },
  backgroundType: 'color',
  backgroundColor: '#ffffff',
  backgroundValue: 'none',
  isPanelDocked: true,
  patternUrl: null,
  setPatternUrl: (url) => set(() => ({ patternUrl: url })),
  textBoxes: [],
  selectedTextBoxId: null,
  overlays: [],

  setSimpleMode: (isSimple) => set(() => ({ isSimpleMode: isSimple })),

  setFont: (font) => set((state) => {
    if (state.selectedTextBoxId) {
      const updatedBoxes = state.textBoxes.map(box =>
        box.id === state.selectedTextBoxId
          ? { ...box, style: { ...box.style, fontFamily: font } }
          : box
      );
      return {
        fontFamily: font,
        textBoxes: updatedBoxes
      };
    }
    return { fontFamily: font };
  }),

  setFontSize: (size) => set((state) => {
    if (state.selectedTextBoxId) {
      const updatedBoxes = state.textBoxes.map(box =>
        box.id === state.selectedTextBoxId
          ? { ...box, style: { ...box.style, fontSize: size } }
          : box
      );
      return {
        fontSize: size,
        textBoxes: updatedBoxes
      };
    }
    return { fontSize: size };
  }),

  setTextColor: (color) => set((state) => {
    if (state.selectedTextBoxId) {
      const updatedBoxes = state.textBoxes.map(box =>
        box.id === state.selectedTextBoxId
          ? { ...box, style: { ...box.style, textColor: color } }
          : box
      );
      return {
        textColor: color,
        textBoxes: updatedBoxes
      };
    }
    return { textColor: color };
  }),

  setTextStyle: (style) => set((state) => {
    const updates = {
      isBold: 'isBold' in style ? style.isBold : state.textStyle.isBold,
      isItalic: 'isItalic' in style ? style.isItalic : state.textStyle.isItalic,
      isUnderline: 'isUnderline' in style ? style.isUnderline : state.textStyle.isUnderline
    };

    if (state.selectedTextBoxId) {
      const updatedBoxes = state.textBoxes.map(box =>
        box.id === state.selectedTextBoxId
          ? { ...box, style: { ...box.style, ...updates } }
          : box
      );
      return {
        textStyle: { ...state.textStyle, ...updates },
        textBoxes: updatedBoxes
      };
    }
    return { textStyle: { ...state.textStyle, ...updates } };
  }),

  setBackground: (type, value) => set((state) => ({
    backgroundType: type,
    backgroundValue: value,
    backgroundColor: type === 'color' ? value : state.backgroundColor
  })),

  setBackgroundColor: (color) => set(() => ({ backgroundColor: color })),
  setPanelDocked: (isDocked) => set(() => ({ isPanelDocked: isDocked })),

  regeneratePattern: () => {
    const pattern = generateRandomPattern();
    set(() => ({
      patternUrl: pattern,
      backgroundType: 'pattern',
      backgroundValue: pattern
    }));
  },

  addTextBox: () => set((state) => {
    const id = crypto.randomUUID();
    const column = state.textBoxes.length % 3;
    const row = Math.floor(state.textBoxes.length / 3);

    const newTextBox: TextBox = {
      id,
      content: '',
      position: {
        x: INITIAL_OFFSET + (column * GRID_SIZE),
        y: INITIAL_OFFSET + (row * GRID_SIZE)
      },
      style: { ...initialTextStyle }
    };

    return {
      textBoxes: [...state.textBoxes, newTextBox],
      selectedTextBoxId: id,
      fontFamily: initialTextStyle.fontFamily,
      fontSize: initialTextStyle.fontSize,
      textColor: initialTextStyle.textColor,
      textStyle: {
        isBold: initialTextStyle.isBold,
        isItalic: initialTextStyle.isItalic,
        isUnderline: initialTextStyle.isUnderline
      }
    };
  }),

  updateTextBox: (id, updates) => set((state) => ({
    textBoxes: state.textBoxes.map((box) =>
      box.id === id ? { ...box, ...updates } : box
    )
  })),

  removeTextBox: (id) => set((state) => ({
    textBoxes: state.textBoxes.filter((box) => box.id !== id),
    selectedTextBoxId: state.selectedTextBoxId === id ? null : state.selectedTextBoxId
  })),

  setSelectedTextBox: (id) => set((state) => {
    if (id === null) return { selectedTextBoxId: null };

    const selectedBox = state.textBoxes.find(box => box.id === id);
    if (selectedBox) {
      return {
        selectedTextBoxId: id,
        fontFamily: selectedBox.style.fontFamily,
        fontSize: selectedBox.style.fontSize,
        textColor: selectedBox.style.textColor,
        textStyle: {
          isBold: selectedBox.style.isBold,
          isItalic: selectedBox.style.isItalic,
          isUnderline: selectedBox.style.isUnderline
        }
      };
    }
    return { selectedTextBoxId: id };
  }),

  updateSelectedTextBoxStyle: (style) => set((state) => {
    if (!state.selectedTextBoxId) return state;
    return {
      textBoxes: state.textBoxes.map(box =>
        box.id === state.selectedTextBoxId
          ? { ...box, style: { ...box.style, ...style } }
          : box
      )
    };
  }),

  addOverlay: (overlay) => set((state) => {
    const id = crypto.randomUUID();
    const existingOverlays = state.overlays.filter(o => o.type === overlay.type);
    const column = existingOverlays.length % 3;
    const row = Math.floor(existingOverlays.length / 3);

    const position = {
      x: INITIAL_OFFSET + (column * GRID_SIZE),
      y: INITIAL_OFFSET + (row * GRID_SIZE)
    };

    return {
      overlays: [...state.overlays, { ...overlay, id, position }]
    };
  }),

  updateOverlayPosition: (id, position) => set((state) => ({
    overlays: state.overlays.map((overlay) =>
      overlay.id === id ? { ...overlay, position } : overlay
    )
  })),

  updateOverlayContent: (id, content) => set((state) => ({
    overlays: state.overlays.map((overlay) =>
      overlay.id === id ? { ...overlay, content } : overlay
    )
  })),

  removeOverlay: (id) => set((state) => ({
    overlays: state.overlays.filter((overlay) => overlay.id !== id)
  }))
}));
