import {create} from "zustand"

interface ProductFormState {
  // Basic Info
  name: string
  slug: string
  sku: string
  shortDescription: string
  description: string
  stock: string
  selectedCategory: string

  // Pricing
  actualPrice: string
  discountedPrice: string
  hasDiscount: boolean

  // Images
  productImages: string[]
  bannerImages: string[]

  // Variants
  selectedColors: string[]
  selectedSizes: string[]
  customColors: {name: string; color: string}[]
  customSizes: {value: string; label: string}[]
  customColorInput: {name: string; color: string}
  customSizeInput: {value: string; label: string; numeric: string; unit: string}

  // Details
  weight: string
  length: string
  width: string
  careInstructions: string
  warranty: string
  deliveryInfo: string
  returnPolicy: string
  features: string[]
  specifications: string[]

  // SEO
  seoTitle: string
  seoDescription: string

  // Settings
  isActive: boolean
  isFeatured: boolean
  freeShipping: boolean
  inStock: boolean
  allowReviews: boolean

  // Tab navigation
  currentTab: string

  // Actions
  setField: (field: string, value: any) => void
  setBasicInfo: (
    data: Partial<
      Pick<
        ProductFormState,
        "name" | "slug" | "sku" | "shortDescription" | "description" | "stock" | "selectedCategory"
      >
    >
  ) => void
  setPricing: (data: Partial<Pick<ProductFormState, "actualPrice" | "discountedPrice" | "hasDiscount">>) => void
  setImages: (data: Partial<Pick<ProductFormState, "productImages" | "bannerImages">>) => void
  setVariants: (
    data: Partial<
      Pick<
        ProductFormState,
        "selectedColors" | "selectedSizes" | "customColors" | "customSizes" | "customColorInput" | "customSizeInput"
      >
    >
  ) => void
  setDetails: (
    data: Partial<
      Pick<
        ProductFormState,
        | "weight"
        | "length"
        | "width"
        | "careInstructions"
        | "warranty"
        | "deliveryInfo"
        | "returnPolicy"
        | "features"
        | "specifications"
      >
    >
  ) => void
  setSEO: (data: Partial<Pick<ProductFormState, "seoTitle" | "seoDescription">>) => void
  setSettings: (
    data: Partial<Pick<ProductFormState, "isActive" | "isFeatured" | "freeShipping" | "inStock" | "allowReviews">>
  ) => void
  setCurrentTab: (tab: string) => void
  addFeature: () => void
  removeFeature: (index: number) => void
  updateFeature: (index: number, value: string) => void
  addSpecification: () => void
  removeSpecification: (index: number) => void
  updateSpecification: (index: number, value: string) => void
  addCustomColor: () => void
  removeCustomColor: (index: number) => void
  addCustomSize: () => void
  removeCustomSize: (index: number) => void
  toggleColor: (colorName: string) => void
  toggleSize: (sizeValue: string) => void
  resetForm: () => void
  setCustomColorInput: (data: Partial<{name: string; color: string}>) => void
  setCustomSizeInput: (data: Partial<{value: string; label: string; numeric: string; unit: string}>) => void
}

const initialState = {
  // Basic Info
  name: "",
  slug: "",
  sku: "",
  shortDescription: "",
  description: "",
  stock: "",
  selectedCategory: "",

  // Pricing
  actualPrice: "",
  discountedPrice: "",
  hasDiscount: false,

  // Images
  productImages: [],
  bannerImages: [],

  // Variants
  selectedColors: [],
  selectedSizes: [],
  customColors: [],
  customSizes: [],
  customColorInput: {name: "", color: "#000000"},
  customSizeInput: {value: "", label: "", numeric: "", unit: ""},

  // Details
  weight: "",
  length: "",
  width: "",
  careInstructions: "",
  warranty: "",
  deliveryInfo: "",
  returnPolicy: "",
  features: [""],
  specifications: [""],

  // SEO
  seoTitle: "",
  seoDescription: "",

  // Settings
  isActive: true,
  isFeatured: false,
  freeShipping: false,
  inStock: true,
  allowReviews: true,

  // Tab navigation
  currentTab: "basic",
}

export const useProductFormStore = create<ProductFormState>((set, get) => ({
  ...initialState,

  setField: (field: string, value: any) => {
    set((state) => ({...state, [field]: value}))
  },

  setCustomColorInput: (data: Partial<{name: string; color: string}>) => {
    set((state) => ({
      customColorInput: {...state.customColorInput, ...data},
    }))
  },

  setCustomSizeInput: (data: Partial<{value: string; label: string; numeric: string; unit: string}>) => {
    set((state) => ({
      customSizeInput: {...state.customSizeInput, ...data},
    }))
  },

  setBasicInfo: (data) => {
    set((state) => ({...state, ...data}))
  },

  setPricing: (data) => {
    set((state) => ({...state, ...data}))
  },

  setImages: (data) => {
    set((state) => ({...state, ...data}))
  },

  setVariants: (data) => {
    set((state) => ({...state, ...data}))
  },

  setDetails: (data) => {
    set((state) => ({...state, ...data}))
  },

  setSEO: (data) => {
    set((state) => ({...state, ...data}))
  },

  setSettings: (data) => {
    set((state) => ({...state, ...data}))
  },

  setCurrentTab: (tab: string) => {
    set({currentTab: tab})
  },

  addFeature: () => {
    set((state) => ({features: [...state.features, ""]}))
  },

  removeFeature: (index: number) => {
    set((state) => ({
      features: state.features.filter((_, i) => i !== index),
      selectedColors: state.selectedColors.filter((c) => c !== state.customColors[index]?.name),
    }))
  },

  updateFeature: (index: number, value: string) => {
    set((state) => ({
      features: state.features.map((feature, i) => (i === index ? value : feature)),
    }))
  },

  addSpecification: () => {
    set((state) => ({specifications: [...state.specifications, ""]}))
  },

  removeSpecification: (index: number) => {
    set((state) => ({
      specifications: state.specifications.filter((_, i) => i !== index),
    }))
  },

  updateSpecification: (index: number, value: string) => {
    set((state) => ({
      specifications: state.specifications.map((spec, i) => (i === index ? value : spec)),
    }))
  },

  addCustomColor: () => {
    const {customColorInput, customColors} = get()
    if (customColorInput.name.trim() && customColorInput.color) {
      set((state) => ({
        customColors: [...state.customColors, {...customColorInput}],
        customColorInput: {name: "", color: "#000000"},
      }))
    }
  },

  removeCustomColor: (index: number) => {
    set((state) => ({
      customColors: state.customColors.filter((_, i) => i !== index),
      selectedColors: state.selectedColors.filter((c) => c !== state.customColors[index]?.name),
    }))
  },

  addCustomSize: () => {
    const {customSizeInput, customSizes} = get()
    if (customSizeInput.numeric.trim() && customSizeInput.unit.trim()) {
      const value = `${customSizeInput.numeric}${customSizeInput.unit}`
      const label = `${customSizeInput.numeric} ${customSizeInput.unit}`
      set((state) => ({
        customSizes: [...state.customSizes, {value, label}],
        customSizeInput: {value: "", label: "", numeric: "", unit: ""},
      }))
    }
  },

  removeCustomSize: (index: number) => {
    set((state) => ({
      customSizes: state.customSizes.filter((_, i) => i !== index),
      selectedSizes: state.selectedSizes.filter((s) => s !== state.customSizes[index]?.value),
    }))
  },

  toggleColor: (colorName: string) => {
    set((state) => ({
      selectedColors: state.selectedColors.includes(colorName)
        ? state.selectedColors.filter((c) => c !== colorName)
        : [...state.selectedColors, colorName],
    }))
  },

  toggleSize: (sizeValue: string) => {
    set((state) => ({
      selectedSizes: state.selectedSizes.includes(sizeValue)
        ? state.selectedSizes.filter((s) => s !== sizeValue)
        : [...state.selectedSizes, sizeValue],
    }))
  },

  resetForm: () => {
    set(initialState)
  },
}))
