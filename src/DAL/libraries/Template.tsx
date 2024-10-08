import React, { useState } from 'react';

// Partial Component
const Partial = ({ name, children }: { name: string, children?: React.ReactNode }) => {
  return <div id={name}>{children}</div>;
};

// Template Component
interface TemplateProps {
  template?: string;
  parser?: boolean;
  cacheTTL?: number;
  widgetPath?: string;
  children?: React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({
  template = 'default-template',
  parser = false,
  cacheTTL = 0,
  widgetPath = '/widgets/',
  children
}) => {
  const [partials, setPartials] = useState<{ [key: string]: string | null }>({});

  const setPartial = (name: string, content: string) => {
    setPartials((prevPartials) => ({
      ...prevPartials,
      [name]: content,
    }));
  };

  const renderPartials = () => {
    return Object.keys(partials).map((key) => (
      <Partial key={key} name={key}>
        {partials[key]}
      </Partial>
    ));
  };

  return (
    <div className={`template ${template}`}>
      <header>Template Header</header>
      {children}
      {renderPartials()}
      <footer>Template Footer</footer>
    </div>
  );
};

// Widget Component
const Widget: React.FC<{ name: string, data?: any }> = ({ name, data }) => {
  // In a real scenario, data fetching or widget logic would be here
  return <div className="widget">{name} widget content</div>;
};

const ExamplePage: React.FC = () => {
  return (
    <Template>
      <h1>Main Page Content</h1>
      <Widget name="RecentPosts" data={{ limit: 5 }} />
    </Template>
  );
};

export default ExamplePage;
