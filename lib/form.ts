export function parseFormData(formData: FormData) {
  const data: Record<string, any> = {}

  for (const [key, value] of formData.entries()) {
    if (key.includes(".")) {
      // Handle nested objects like dimensions.length
      const [parent, child] = key.split(".")
      if (!data[parent]) {
        data[parent] = {}
      }
      data[parent][child] = value
    } else {
      // Handle arrays (multiple values with same key)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value)
        } else {
          data[key] = [data[key], value]
        }
      } else {
        data[key] = value
      }
    }
  }

  return data
}

export function parseBooleanFields(data: Record<string, any>, booleanFields: string[]) {
  const parsed = {...data}

  booleanFields.forEach((field) => {
    if (field in parsed) {
      parsed[field] = parsed[field] === "on" || parsed[field] === "true"
    }
  })

  return parsed
}

export function parseArrayFields(data: Record<string, any>, arrayFields: string[]) {
  const parsed = {...data}

  arrayFields.forEach((field) => {
    if (field in parsed) {
      if (Array.isArray(parsed[field])) {
        parsed[field] = parsed[field].filter(Boolean)
      } else {
        parsed[field] = parsed[field] ? [parsed[field]] : []
      }
    }
  })

  return parsed
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]) {
  const errors: Record<string, string[]> = {}

  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      errors[field] = [`${field} is required`]
    }
  })

  return errors
}
