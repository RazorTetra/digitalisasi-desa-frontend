// src/app/(main)/informasi-desa/_components/SocialMediaCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import type { SocialMedia } from "@/api/villageApi";

interface SocialMediaCardProps {
  socialMedia: SocialMedia[];
}

export const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ socialMedia }) => {
  const getSocialMediaIcon = (platform: string) => {
    const iconProps = { className: "h-5 w-5" };

    switch (platform.toLowerCase()) {
      case "facebook":
        return <FacebookIcon {...iconProps} />;
      case "instagram":
        return <InstagramIcon {...iconProps} />;
      case "twitter":
        return <XIcon {...iconProps} />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Sosial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-4">
          {socialMedia.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${item.platform}`}
              >
                {getSocialMediaIcon(item.platform)}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};