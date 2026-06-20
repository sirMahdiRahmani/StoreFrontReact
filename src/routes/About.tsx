import { SectionHeading } from "../components/SectionHeading";
import { GiltDivider } from "../components/Divider";
import { Reveal } from "../components/Reveal";
import { PhoneIcon, InstagramIcon } from "../components/icons";
import { faDigits } from "../lib/format";

export function About() {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading eyebrow="دربارهٔ ملورا" title="ساخته‌شده با دست، با عشق" />
        <p className="mt-6 text-text-2 leading-relaxed">
          ملورا با دقت و عشق به جزئیات، قطعاتی می‌سازد که داستان خودشان را روایت می‌کنند. هر طرح در
          کارگاه ما طراحی و به‌صورت دستی تکمیل می‌شود — تا چیزی به دست شما برسد که هم زیبا باشد و هم
          ماندگار.
        </p>
      </div>

      <GiltDivider className="my-12" />

      <div className="mx-auto max-w-2xl">
        <SectionHeading eyebrow="در ارتباط باشیم" title="تماس با ما" align="start" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Reveal
            as="div"
            delay={0}
          >
            <a
              href="tel:+982112345678"
              className="flex items-center gap-3 rounded-card border border-line-card bg-surface p-4 transition-colors hover:border-gilt/50"
            >
              <PhoneIcon className="h-5 w-5 text-gilt" />
              <span className="flex flex-col">
                <span className="text-xs text-text-3">تلفن</span>
                <span dir="ltr" className="text-start text-text-1">{faDigits("021-12345678")}</span>
              </span>
            </a>
          </Reveal>
          <Reveal as="div" delay={90}>
            <a
              href="https://instagram.com/mellora.shop"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-card border border-line-card bg-surface p-4 transition-colors hover:border-gilt/50"
            >
              <InstagramIcon className="h-5 w-5 text-gilt" />
              <span className="flex flex-col">
                <span className="text-xs text-text-3">اینستاگرام</span>
                <span className="text-text-1">mellora.shop@</span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
