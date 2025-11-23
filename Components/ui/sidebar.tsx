import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const SidebarContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
    toggleSidebar: () => void
} | null>(null)

function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}

const SidebarProvider = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }
>(({ defaultOpen = true, className, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen)

    const toggleSidebar = React.useCallback(() => {
        setOpen((prev) => !prev)
    }, [])

    return (
        <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
            <div
                ref={ref}
                className={`flex min-h-screen w-full ${className || ""}`}
                {...props}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    )
})
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { collapsible?: "none" | "icon" }
>(({ className, children, collapsible, ...props }, ref) => {
    const { open } = useSidebar()

    if (!open && collapsible !== "none") {
        return null
    }

    return (
        <div
            ref={ref}
            className={`flex h-screen w-[260px] flex-col border-r bg-background ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    )
})
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
    React.ElementRef<typeof Button>,
    React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            className={className}
            onClick={(event) => {
                onClick?.(event)
                toggleSidebar()
            }}
            {...props}
        >
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`flex flex-col gap-2 p-2 ${className || ""}`}
        {...props}
    />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`flex min-h-0 flex-1 flex-col gap-2 overflow-auto ${className || ""}`}
        {...props}
    />
))
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`relative flex w-full min-w-0 flex-col p-2 ${className || ""}`}
        {...props}
    />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 ${className || ""}`}
        {...props}
    />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`w-full text-sm ${className || ""}`}
        {...props}
    />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={`flex w-full min-w-0 flex-col gap-1 ${className || ""}`}
        {...props}
    />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
    HTMLLIElement,
    React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        className={`group/menu-item relative ${className || ""}`}
        {...props}
    />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            ref={ref}
            className={`peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 ${className || ""}`}
            {...props}
        />
    )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`flex flex-col gap-2 p-2 ${className || ""}`}
        {...props}
    />
))
SidebarFooter.displayName = "SidebarFooter"

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
}
