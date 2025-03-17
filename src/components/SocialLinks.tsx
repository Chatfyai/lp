
interface SocialLinkProps {
  icon: string;
  title: string;
  href: string;
}

const SocialLink = ({ icon, title, href }: SocialLinkProps) => {
  return (
    <a 
      href={href} 
      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center transition-transform hover:scale-110 no-underline text-store-primary shadow-sm"
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
};

const SocialLinks = () => {
  return (
    <div className="flex justify-center gap-4 mt-5">
      <SocialLink icon="ƒ" title="Facebook" href="#" />
      <SocialLink icon="𝕏" title="Twitter" href="#" />
      <SocialLink icon="▶" title="YouTube" href="#" />
      <SocialLink icon="𝕋" title="TikTok" href="#" />
    </div>
  );
};

export default SocialLinks;
