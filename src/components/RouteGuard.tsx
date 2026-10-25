"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

const checkRouteEnabledSync = (path: string | null) => {
  if (!path) return true;
  if (path in routes) {
    return !!routes[path as keyof typeof routes];
  }
  const dynamicRoutes = ["/blog", "/work", "/services"] as const;
  for (const route of dynamicRoutes) {
    if (path.startsWith(route) && routes[route]) {
      return true;
    }
  }
  return false;
};

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const initialEnabled = checkRouteEnabledSync(pathname);
  const isProtected = Boolean(pathname && protectedRoutes[pathname as keyof typeof protectedRoutes]);

  const [isRouteEnabled, setIsRouteEnabled] = useState(initialEnabled);
  const [isPasswordRequired, setIsPasswordRequired] = useState(isProtected);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(isProtected);

  useEffect(() => {
    const performChecks = async () => {
      const routeEnabled = checkRouteEnabledSync(pathname);
      setIsRouteEnabled(routeEnabled);

      if (pathname && protectedRoutes[pathname as keyof typeof protectedRoutes]) {
        setIsPasswordRequired(true);
        setLoading(true);
        const response = await fetch("/api/check-auth");
        if (response.ok) {
          setIsAuthenticated(true);
        }
        setLoading(false);
      } else {
        setIsPasswordRequired(false);
        setLoading(false);
      }
    };

    performChecks();
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  if (isPasswordRequired && !isAuthenticated) {
    return (
      <Column paddingY="128" maxWidth={24} gap="24" center>
        <Heading align="center" wrap="balance">
          This page is password protected
        </Heading>
        <Column fillWidth gap="8" horizontal="center">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
          />
          <Button onClick={handlePasswordSubmit}>Submit</Button>
        </Column>
      </Column>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
