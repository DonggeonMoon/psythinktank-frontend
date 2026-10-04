import * as React from "react";

// animated-gradient-border 클래스를 준 컨테이너의 마지막 자식으로 넣는다. 스타일은 global.css 참고.
const AnimatedGradientBorder: React.FC = () => (
    <span aria-hidden="true" className="animated-gradient-border-track">
        <span className="animated-gradient-border-light"/>
    </span>
);

export default AnimatedGradientBorder;
