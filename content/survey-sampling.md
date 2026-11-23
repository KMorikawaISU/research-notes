---
title: Survey Sampling
description: A short example of estimating a finite population total.
tags:
  - example
---

**EXAMPLE — A short sample note.**

## Horvitz–Thompson total

Consider a finite population $U=\{1,\ldots,N\}$ with fixed values $y_i$ and total $T_y=\sum_{i=1}^N y_i$. A probability sampling design selects a sample $s\subseteq U$. Let $\pi_i=P(i\in s)>0$ be the inclusion probability of unit $i$. The Horvitz–Thompson estimator is

$$
\widehat{T}_{\mathrm{HT}}=\sum_{i\in s}\frac{y_i}{\pi_i}.
$$

Each sampled value receives weight $1/\pi_i$. When sampled values are fully observed, this estimator is unbiased under the sampling design: $E_p(\widehat{T}_{\mathrm{HT}})=T_y$.

## Connection to missing data

Survey nonresponse leaves some sampled values unobserved, connecting this topic to [[missing-data-analysis|Missing Data Analysis]]. Sampling weights alone generally do not correct nonresponse. Valid adjustment requires assumptions about response or outcomes, for example through response-probability weighting or imputation.

Reference: [Horvitz and Thompson (1952)](https://doi.org/10.1080/01621459.1952.10483446).

[[index|Return to Research Notes]].
