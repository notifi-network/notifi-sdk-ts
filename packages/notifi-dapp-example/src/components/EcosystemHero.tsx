import Image from 'next/image';

export type EcosystemHeroProps = {
  isLoading: boolean;
  cta?: () => void;
  ctaButtonText: string;
};

const title1 = process.env.NEXT_PUBLIC_HOME_PAGE_TITLE_1;
const title2 = process.env.NEXT_PUBLIC_HOME_PAGE_TITLE_2;
const subtitle = process.env.NEXT_PUBLIC_HOME_PAGE_SUBTITLE;

export const EcosystemHero: React.FC<EcosystemHeroProps> = ({
  isLoading,
  cta,
  ctaButtonText,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-notifi-card-bg px-10 py-6 md:p-10 w-11/12 md:max-w-[33.37rem] rounded-3xl">
      <div className="flex items-center w-48 gap-3">
        <Image
          src="/logos/gmx-notifi-logo.png"
          width={195}
          height={44}
          alt="Injective"
          unoptimized={true}
        />
      </div>

      <div className="md:text-[40px] text-2xl font-semibold leading-10 text-notifi-text">
        {title1} <span className="text-notifi-primary-text">{title2}</span>
      </div>

      <div className="text-notifi-grey-text">{subtitle}</div>

      <button className=" bg-notifi-button-primary-blueish-bg w-52 h-11 cursor-pointer rounded-lg text-white">
        {isLoading ? (
          <div className="m-auto h-5 w-5 animate-spin rounded-full  border-2 border-white border-b-transparent border-l-transparent"></div>
        ) : (
          <div onClick={() => cta?.()}>{ctaButtonText}</div>
        )}
      </button>
    </div>
  );
};
