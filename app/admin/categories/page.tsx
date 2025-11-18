"use client"

import {useState, useEffect} from "react"
import {useActionState} from "react"
import {toast} from "sonner"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Plus, Search, Edit, Trash2, MoreHorizontal, Calendar, Tag} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {generateSlug} from "@/lib/utils"
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  type CategoryActionState,
} from "@/actions/category"
import {DeleteConfirmationDialog} from "@/components/custom/DeleteConfirmationDialog"

interface Category {
  _id: string
  name: string
  description: string | null
  slug: string
  createdAt: string
  updatedAt: string
}

const initialState: CategoryActionState = {}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const [addState, addAction] = useActionState(createCategory, initialState)
  const [editState, setEditState] = useState<CategoryActionState>({})

  const handleEditSubmit = async (formData: FormData) => {
    if (!editingCategory) return

    const result = await updateCategory(editingCategory._id, {}, formData)
    setEditState(result)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (addState.success) {
      toast.success("Category created successfully!")
      setIsAddDialogOpen(false)
      fetchCategories()
      addState.success = false
    } else if (addState.error) {
      toast.error(addState.error)
    }
  }, [addState.success, addState.error, addState])

  useEffect(() => {
    if (editState.success) {
      toast.success("Category updated successfully!")
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      fetchCategories()
      editState.success = false
    } else if (editState.error) {
      toast.error(editState.error)
    }
  }, [editState.success, editState.error, editState])

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId)
    if (category) {
      setDeletingCategory(category)
      setIsDeleteDialogOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (!deletingCategory) return

    const result = await deleteCategory(deletingCategory._id, {})
    if (result.success) {
      toast.success("Category deleted successfully!")
      fetchCategories()
      setDeletingCategory(null)
    } else {
      toast.error(result.error || "Failed to delete category")
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories and organize your inventory.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category to organize your products.</DialogDescription>
            </DialogHeader>
            <form action={addAction}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="block mb-2">
                    Name
                  </Label>
                  <Input id="name" name="name" placeholder="Enter category name" required />
                </div>
                <div>
                  <Label htmlFor="description" className="block mb-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter category description (optional)"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Categories</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No categories found matching your search."
                  : "No categories yet. Create your first category to get started."}
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description || "No description"}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {category.slug}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created {formatDate(category.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteCategory(category._id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category information.</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <form action={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name" className="block mb-2">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingCategory.name}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description" className="block mb-2">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingCategory.description || ""}
                    placeholder="Enter category description (optional)"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Category</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingCategory(null)
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        itemName={deletingCategory?.name}
      />
    </div>
  )
}
