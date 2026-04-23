import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";

// Terms of Use body. Kept as a standalone component (mirroring the
// PrivacyContent pattern) so translations / clause edits don't churn
// the route file. Effective date is rendered explicitly so any update
// visibly changes the footer date alongside the clause diff.
const EFFECTIVE_DATE = "2026년 4월 23일";

export default function TermsContent() {
  return (
    <article className="flex flex-col gap-10 text-t5 text-grey-800 leading-relaxed">
      <section>
        <h2 className="text-t3 md:text-t2 font-bold text-grey-900 tracking-tight mb-3">
          제1조 (목적)
        </h2>
        <p>
          이 약관은 {SITE_NAME}(이하 &quot;서비스&quot;)의 이용 조건과 절차에
          관한 사항을 정하는 것을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-t3 md:text-t2 font-bold text-grey-900 tracking-tight mb-3">
          제2조 (서비스 성격)
        </h2>
        <p>
          {SITE_NAME}는 성균관대학교 학생이 자율적으로 운영하는 비공식
          서비스이며, 성균관대학교의 공식 서비스가 아닙니다. 공식 정보는
          성균관대학교의 공식 웹사이트와 안내 채널을 통해 확인해 주세요.
        </p>
      </section>

      <section>
        <h2 className="text-t3 md:text-t2 font-bold text-grey-900 tracking-tight mb-3">
          제3조 (정보 제공의 한계)
        </h2>
        <p>
          서비스는 성균관대학교의 공식 자료와 공개된 정보를 바탕으로
          셔틀버스, 공지, 캠퍼스 정보 등을 제공합니다. 다만 이러한 정보의
          완전성·정확성·최신성을 보장하지 않으며, 학기별 시간표·요금·공지
          내용 등은 수시로 변경될 수 있습니다. 실제 이용 전 공식 채널에서 최신
          정보를 재확인할 책임은 이용자에게 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-t3 md:text-t2 font-bold text-grey-900 tracking-tight mb-3">
          제4조 (책임한계와 법적고지)
        </h2>
        <ul className="flex flex-col gap-3 list-disc pl-5">
          <li>
            {SITE_NAME}는 성균관대학교와 법적·운영상 아무런 관계가 없는 비공식
            학생 서비스입니다. 서비스에 포함된 성균관대학교 관련 명칭, 로고,
            캠퍼스 이름 등은 오직 식별 목적으로 사용되며, 성균관대학교의
            상표권·저작권·기타 권리에 대한 침해 의사가 없습니다.
          </li>
          <li>
            서비스가 제공하는 셔틀버스 운행 시간·요금·경로, 공지 요약, 캠퍼스
            안내 등 모든 정보의 정확성과 완전성에 대해 운영팀은 법적 책임을
            지지 않습니다. 이용자는 제공된 정보를 참고용으로만 활용해야
            합니다.
          </li>
          <li>
            서비스의 이용 또는 서비스에 포함된 정보에 대한 신뢰로 인해 발생한
            직접·간접·부수적 손해에 대해 운영팀은 고의 또는 중대한 과실이
            없는 한 책임을 지지 않습니다.
          </li>
          <li>
            서비스에서 외부 사이트로 연결되는 링크가 제공될 수 있으며, 해당
            외부 사이트의 콘텐츠·정책·정확성에 대해 {SITE_NAME}는 책임지지
            않습니다.
          </li>
          <li>
            이용자는 서비스 이용 과정에서 관련 법령 및 성균관대학교 규정을
            준수해야 하며, 이를 위반하여 발생한 문제에 대한 책임은 이용자
            본인에게 있습니다.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-t3 md:text-t2 font-bold text-grey-900 tracking-tight mb-3">
          제5조 (지적재산권)
        </h2>
        <p>
          서비스에서 {SITE_NAME} 운영팀이 직접 제작한 콘텐츠(디자인·문구·이미지
          등)의 저작권은 운영팀에 있습니다. 성균관대학교가 공개한 공지 등의
          원문 저작권은 해당 저작권자에게 있으며, {SITE_NAME}는 이를 요약·
          재구성하여 학생 편의 목적으로 제공합니다.
        </p>
      </section>

      <section>
        <h2 className="text-t3 md:text-t2 font-bold text-grey-900 tracking-tight mb-3">
          제6조 (약관의 변경)
        </h2>
        <p>
          운영팀은 필요한 경우 이 약관을 개정할 수 있으며, 개정 시 시행일을
          명시하여 서비스 내에 공지합니다. 개정된 약관에 동의하지 않는
          이용자는 서비스 이용을 중단할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-t3 md:text-t2 font-bold text-grey-900 tracking-tight mb-3">
          제7조 (문의)
        </h2>
        <p>
          서비스 관련 문의는 이메일({" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-brand underline decoration-grey-300 underline-offset-4 hover:decoration-brand"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          )로 보내주세요.
        </p>
      </section>

      <footer className="pt-6 border-t border-grey-200 text-t6 text-grey-500">
        시행일: {EFFECTIVE_DATE}
      </footer>
    </article>
  );
}
