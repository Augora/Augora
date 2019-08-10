import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const HeaderStyle = styled.section`
    overflow: hidden;
    background-color: #f1f1f1;
    padding: 20px 10px;
`;

interface HeaderProps<T> {
    match: {
        params: T;
    };
}

interface HeaderParams {
    id: string;
}

function Header(props: HeaderProps<HeaderParams>) {
    return (
        <HeaderStyle>
            <a href="#default" className="logo">
                La bête poli logo
            </a>
            <div className="header-right">
                <a className="active" href="#home">
                    Home logo
                </a>
                <a href="#contact">Contact logo</a>
                <a href="#about">About logo</a>
            </div>
        </HeaderStyle>
    );
}
