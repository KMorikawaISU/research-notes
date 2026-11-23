---
title: Singular Value Decomposition
aliases:
  - SVD
description: A matrix decomposition connecting geometry, PCA, and low-rank approximation.
tags:
  - mathematics
---

> [!note] Starter example
> A concise reference for the compact SVD and its statistical connections.

## Compact decomposition

For a matrix $X\in\mathbb{R}^{n\times p}$ of rank $r\geq 1$, the compact SVD is

$$
X=U_rD_rV_r^\top,
$$

where $U_r\in\mathbb{R}^{n\times r}$ and $V_r\in\mathbb{R}^{p\times r}$ have orthonormal columns, and

$$
D_r=\operatorname{diag}(d_1,\ldots,d_r),
\qquad d_1\geq\cdots\geq d_r>0.
$$

Consequently,

$$
X^\top X=V_rD_r^2V_r^\top.
$$

This explains why the right singular vectors supply the nonzero-variance principal directions in [[Principal Component Analysis]] when $X$ is column-centered.

## Approximation with fewer components

For $1\leq k\leq r$, retaining the first $k$ singular components gives

$$
X_k=U_kD_kV_k^\top
\in\underset{\operatorname{rank}(A)\leq k}{\operatorname{arg\,min}}\|X-A\|_F.
$$

The squared approximation error is

$$
\|X-X_k\|_F^2=\sum_{j=k+1}^{r}d_j^2.
$$

This is a best approximation in Frobenius norm; it need not be unique when singular values are tied.

## Connections

- [[Linear Algebra]] supplies the ideas of orthogonality, rank, and matrix transformations.
- [[Multivariate Data Analysis]] uses these tools to summarize a data matrix.
- [[Principal Component Analysis]] interprets the decomposition in terms of sample variation.
