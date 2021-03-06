import React, { useState, useEffect, useRef } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { navLinks } from '@config';
import { KEY_CODES } from '@utils';
import { useOnClickOutside } from '@hooks';

const StyledMenu = styled.div`
  display: none;

  @media (${({ theme }) => theme.bp.tabletL}) {
    display: block;
  }
`;

const StyledHamburgerButton = styled.button`
  display: none;

  @media (${({ theme }) => theme.bp.tabletL}) {
    ${({ theme }) => theme.mixins.flexCenter};
    position: relative;
    z-index: 10;
    padding: 15px;
    margin-right: -15px;
    border: 0;
    color: inherit;
    background-color: transparent;
    text-transform: none;
    transition-timing-function: linear;
    transition-duration: 0.15s;
    transition-property: opacity, filter;
  }

  .ham-box {
    position: relative;
    display: inline-block;
    width: ${({ theme }) => theme.hamburgerWidth};
    height: 24px;
  }

  .ham-box-inner {
    background-color: ${({ theme }) => theme.colors.green};
    position: absolute;
    width: ${({ theme }) => theme.hamburgerWidth};
    height: 2px;
    border-radius: ${({ theme }) => theme.borderRadius};
    top: 50%;
    right: 0;
    transition-duration: 0.22s;
    transition-property: transform;
    transition-delay: ${props => (props.menuOpen ? `0.12s` : `0s`)};
    transform: rotate(${props => (props.menuOpen ? `225deg` : `0deg`)});
    transition-timing-function: cubic-bezier(
      ${props => (props.menuOpen ? `0.215, 0.61, 0.355, 1` : `0.55, 0.055, 0.675, 0.19`)}
    );
    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      left: auto;
      right: 0;
      width: ${({ theme }) => theme.hamburgerWidth};
      height: 2px;
      transition-timing-function: ease;
      transition-duration: 0.15s;
      transition-property: transform;
      background-color: ${({ theme }) => theme.colors.green};
      border-radius: 4px;
    }
    &:before {
      width: ${props => (props.menuOpen ? `100%` : `120%`)};
      top: ${props => (props.menuOpen ? `0` : `-10px`)};
      opacity: ${props => (props.menuOpen ? 0 : 1)};
      transition: ${({ theme, menuOpen }) => (menuOpen ? theme.hamBeforeActive : theme.hamBefore)};
    }
    &:after {
      width: ${props => (props.menuOpen ? `100%` : `80%`)};
      bottom: ${props => (props.menuOpen ? `0` : `-10px`)};
      transform: rotate(${props => (props.menuOpen ? `-90deg` : `0`)});
      transition: ${({ theme, menuOpen }) => (menuOpen ? theme.hamAfterActive : theme.hamAfter)};
    }
  }
`;

const StyledSidebar = styled.aside`
  display: none;

  @media (${({ theme }) => theme.bp.tabletL}) {
    ${({ theme }) => theme.mixins.flexCenter};
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 50px;
    width: 50vw;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.lightNavy};
    box-shadow: -10px 0px 30px -15px ${({ theme }) => theme.colors.shadowNavy};
    z-index: 9;
    outline: 0;
    transition: ${({ theme }) => theme.transition};
    transform: translateX(${props => (props.menuOpen ? 0 : 100)}vw);
    visibility: ${props => (props.menuOpen ? 'visible' : 'hidden')};
  }

  @media (${({ theme }) => theme.bp.tabletS}) {
    padding: 25px;
  }
  @media (${({ theme }) => theme.bp.mobileL}) {
    width: 75vw;
  }
  @media (${({ theme }) => theme.bp.mobileS}) {
    padding: 10px;
  }

  nav {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    flex-direction: column;
    text-align: center;
    color: ${({ theme }) => theme.colors.lightestSlate};
    font-family: ${({ theme }) => theme.fonts.SFMono};
  }

  ol {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;

    li {
      margin: 0 auto 20px;
      position: relative;
      font-size: ${({ theme }) => theme.fontSizes.lg};
      counter-increment: item 1;

      @media (${({ theme }) => theme.bp.tabletS}) {
        margin: 0 auto 10px;
        font-size: ${({ theme }) => theme.fontSizes.md};
      }

      @media (${({ theme }) => theme.bp.mobileS}) {
        font-size: ${({ theme }) => theme.fontSizes.xs};
      }

      &:before {
        display: block;
        content: '0' counter(item) '.';
        color: ${({ theme }) => theme.colors.green};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        margin-bottom: 5px;
      }
    }

    a {
      ${({ theme }) => theme.mixins.link};
      padding: 3px 20px 20px;
      width: 100%;
    }
  }

  .resume-link {
    ${({ theme }) => theme.mixins.bigButton};
    padding: 18px 50px;
    margin: 10% auto 0;
    width: max-content;
  }
`;

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const buttonRef = useRef(null);
  const navRef = useRef(null);

  let menuFocusables;
  let firstFocusableEl;
  let lastFocusableEl;

  const setFocusables = () => {
    menuFocusables = [buttonRef.current, ...Array.from(navRef.current.querySelectorAll('a'))];
    firstFocusableEl = menuFocusables[0];
    lastFocusableEl = menuFocusables[menuFocusables.length - 1];
  };

  const handleBackwardTab = e => {
    if (document.activeElement === firstFocusableEl) {
      e.preventDefault();
      lastFocusableEl.focus();
    }
  };

  const handleForwardTab = e => {
    if (document.activeElement === lastFocusableEl) {
      e.preventDefault();
      firstFocusableEl.focus();
    }
  };

  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ESCAPE:
      case KEY_CODES.ESCAPE_IE11: {
        setMenuOpen(false);
        break;
      }

      case KEY_CODES.TAB: {
        if (menuFocusables && menuFocusables.length === 1) {
          e.preventDefault();
          break;
        }
        if (e.shiftKey) {
          handleBackwardTab(e);
        } else {
          handleForwardTab(e);
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  const onResize = e => {
    if (e.currentTarget.innerWidth > 768) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    setFocusables();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const wrapperRef = useRef();
  useOnClickOutside(wrapperRef, () => setMenuOpen(false));

  return (
    <StyledMenu>
      <Helmet>
        <body className={menuOpen ? 'blur' : ''} />
      </Helmet>

      <div ref={wrapperRef}>
        <StyledHamburgerButton onClick={toggleMenu} menuOpen={menuOpen} ref={buttonRef}>
          <div className="ham-box">
            <div className="ham-box-inner" />
          </div>
        </StyledHamburgerButton>

        <StyledSidebar menuOpen={menuOpen} aria-hidden={!menuOpen} tabIndex={menuOpen ? 1 : -1}>
          <nav ref={navRef}>
            {navLinks && (
              <ol>
                {navLinks.map(({ url, name }, i) => (
                  <li key={i}>
                    <Link to={url}>{name}</Link>
                  </li>
                ))}
              </ol>
            )}

            <a href="/resume.pdf" className="resume-link">
              Resume
            </a>
          </nav>
        </StyledSidebar>
      </div>
    </StyledMenu>
  );
};

export default Menu;
