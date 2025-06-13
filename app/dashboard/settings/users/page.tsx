"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"

// Mock user data
interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff"
  status: "active" | "inactive"
  lastLogin: Date | null
}

const mockUsers: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@slvehiclerental.com",
    role: "admin",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "u2",
    name: "Manager User",
    email: "manager@slvehiclerental.com",
    role: "manager",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "u3",
    name: "Staff User 1",
    email: "staff1@slvehiclerental.com",
    role: "staff",
    status: "active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "u4",
    name: "Staff User 2",
    email: "staff2@slvehiclerental.com",
    role: "staff",
    status: "inactive",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },
]

export default function UsersPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

  // New user form
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"admin" | "manager" | "staff">("staff")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return

    // Simulate loading users
    const timeout = setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [user])

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Admin
          </Badge>
        )
      case "manager":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Manager
          </Badge>
        )
      case "staff":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Staff
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Inactive
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add new user to the list
      const newUser: User = {
        id: `u${users.length + 1}`,
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        status: "active",
        lastLogin: null,
      }

      setUsers([...users, newUser])

      // Reset form
      setNewUserName("")
      setNewUserEmail("")
      setNewUserRole("staff")
      setShowAddUserDialog(false)

      toast({
        title: "User added",
        description: `${newUserName} has been added as a ${newUserRole}.`,
      })
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: "Error adding user",
        description: "There was an error adding the user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangeRole = (userId: string, newRole: "admin" | "manager" | "staff") => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, role: newRole }
      }
      return user
    })

    setUsers(updatedUsers)

    const user = users.find((u) => u.id === userId)

    toast({
      title: "Role updated",
      description: `${user?.name}'s role has been updated to ${newRole}.`,
    })
  }

  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const newStatus = user.status === "active" ? "inactive" : "active"
        return { ...user, status: newStatus }
      }
      return user
    })

    setUsers(updatedUsers)

    const user = users.find((u) => u.id === userId)
    const newStatus = user?.status === "active" ? "inactive" : "active"

    toast({
      title: "Status updated",
      description: `${user?.name}'s status has been set to ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users & Permissions</h1>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddUserDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage users and their permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                              {user.status === "active" ? "Deactivate User" : "Activate User"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user.id, "admin")}
                              disabled={user.role === "admin"}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user.id, "manager")}
                              disabled={user.role === "manager"}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make Manager
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(user.id, "staff")}
                              disabled={user.role === "staff"}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make Staff
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account and set their permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUserRole}
                onValueChange={(value) => setNewUserRole(value as "admin" | "manager" | "staff")}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {newUserRole === "admin"
                  ? "Admins have full access to all features and settings."
                  : newUserRole === "manager"
                    ? "Managers can manage bookings, vehicles, and customers, but cannot access system settings."
                    : "Staff can view and create bookings, but have limited access to other features."}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                "Add User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
