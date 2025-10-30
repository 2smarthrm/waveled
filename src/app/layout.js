"use client"
import "~/assets/css/bootstrap.min.css";
import "~/assets/css/remixicon.css";
import "~/assets/css/fontawesome.css";
import "~/assets/css/main.css";
import "~/assets/css/app.css";
import "~/assets/css/app.min.css";
import "~/assets/css/animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "~/assets/css/react-adjustment.css";
import "~/assets/css/aos.css";
import "~/assets/css/magnific-popup.css";
import React, { useEffect, useState } from "react";
import { Metadata } from "~/components/Section/Common/Metadata/Metadata";
import { usePathname } from "next/navigation";
import Loading from "~/components/Section/Common/Loading/Loading";

 
 
export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Adjust the loading duration as needed

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en">
        <head>
        <title>{"Waveled" || Metadata.title}</title>
        <meta name="description" content={"A Waveled é uma empresa inovadora especializada em soluções display led. Apoiamos marcas, eventos e espaços comerciais com projetos chave-na-mão: consultoria, conceção, instalação, operação e manutenção" || Metadata.description} />
        {Metadata.icons && (
          <React.Fragment>
            {Metadata.icons.icon.map((icon, index) => (
              <link key={index} rel="icon" href={icon} />
            ))}
            {Metadata.icons.apple && Metadata.icons.apple.map((appleIcon, index) => (
              <link key={index} rel="apple-touch-icon" href={appleIcon} />
            ))}
            {Metadata.icons.shortcut && Metadata.icons.shortcut.map((shortcutIcon, index) => (
              <link key={index} rel="shortcut icon" href={shortcutIcon} />
            ))}
          </React.Fragment>
        )}
      </head>
      <body >  
         <Loading isLoading={isLoading} />
        {!isLoading && children}
      </body>
    </html>
  );
}
