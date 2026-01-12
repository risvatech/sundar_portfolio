"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "../lib/utils";

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
    className?: string;
    activeClassName?: string;
    pendingClassName?: string;
    exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
    ({ className, activeClassName, pendingClassName, exact = false, href, ...props }, ref) => {
        const pathname = usePathname();

        // Handle string or object href
        const hrefPath = typeof href === "string" ? href : href.pathname || "";

        // Check if the link is active
        const isActive = exact
            ? pathname === hrefPath
            : pathname.startsWith(hrefPath) && hrefPath !== "/";

        // Note: Next.js doesn't have a built-in pending state for links
        // You can remove pendingClassName or implement your own logic

        return (
            <Link
                ref={ref}
                href={href}
                className={cn(
                    className,
                    isActive && activeClassName
                )}
                {...props}
            />
        );
    },
);

NavLink.displayName = "NavLink";

export { NavLink };