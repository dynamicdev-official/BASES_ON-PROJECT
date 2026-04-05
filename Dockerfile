########################################################################
#
# bases_on — Database Dashboard by dynamicdev_
#
# Copyright (C) 2024 - 2026, dynamicdev_ — All Rights Reserved
#
#########################################################################

#########################################################################
# Create a Node container which will be used to build the JS components
# and clean up the web/ source code
#########################################################################

FROM alpine:latest AS app-builder

RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    g++ \
    git \
    libc6-compat \
    libjpeg-turbo-dev \
    libpng-dev \
    libtool \
    make \
    nasm \
    nodejs \
    npm \
    yarn \
    zlib-dev

# Create the /pgadmin4 directory and copy the source into it. Explicitly
# remove the node_modules directory as we'll recreate a clean version, as well
# as various other files we don't want
COPY web /pgadmin4/web
RUN rm -rf /pgadmin4/web/*.log \
           /pgadmin4/web/config_*.py \
           /pgadmin4/web/node_modules \
           /pgadmin4/web/regression \
           `find /pgadmin4/web -type d -name tests` \
           `find /pgadmin4/web -type f -name .DS_Store`

WORKDIR /pgadmin4/web

# Build the JS vendor code in the app-builder, and then remove the vendor source.
RUN export CPPFLAGS="-DPNG_ARM_NEON_OPT=0" && \
    npm install -g corepack && \
    corepack enable && \
    yarn set version berry && \
    yarn set version 3 && \
    yarn install && \
    yarn run bundle && \
    rm -rf node_modules \
           yarn.lock \
           package.json \
           .[^.]* \
           babel.cfg \
           webpack.* \
           jest.config.js \
           babel.* \
           ./pgadmin/static/js/generated/.cache

#########################################################################
# Next, create the base environment for Python
#########################################################################

FROM alpine:latest AS env-builder

# Install dependencies
COPY requirements.txt /
RUN     apk add --no-cache \
        make \
        python3 \
        py3-pip \
        py3-cryptography \
        py3-bcrypt \
        py3-setuptools \
        py3-psutil \
        py3-pillow && \
    apk add --no-cache --virtual build-deps \
        build-base \
        openssl-dev \
        libffi-dev \
        postgresql-dev \
        krb5-dev \
        rust \
        cargo \
        zlib-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libsodium-dev \
        python3-dev && \
    python3 -m venv --system-site-packages --without-pip /venv && \
    /venv/bin/python3 -m pip install --no-cache-dir -r requirements.txt && \
    apk del --no-cache build-deps

#########################################################################
# Now, create a documentation build container for the Sphinx docs
#########################################################################

FROM env-builder AS docs-builder

# Install Sphinx
RUN /venv/bin/python3 -m pip install --no-cache-dir sphinx
# Skipping docs build for Bases_on production speed
# RUN /venv/bin/python3 -m pip install --no-cache-dir sphinxcontrib-youtube

# Copy the docs from the local tree. Explicitly remove any existing builds that
# may be present
COPY docs /pgadmin4/docs
COPY web /pgadmin4/web
# RUN rm -rf /pgadmin4/docs/en_US/_build

# Build the docs (Skipped)
# RUN LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8 /venv/bin/sphinx-build /pgadmin4/docs/en_US /pgadmin4/docs/en_US/_build/html

# Cleanup unwanted files (Skipped)
# RUN rm -rf /pgadmin4/docs/en_US/_build/html/.doctrees
# RUN rm -rf /pgadmin4/docs/en_US/_build/html/_sources
# RUN rm -rf /pgadmin4/docs/en_US/_build/html/_static/*.png

#########################################################################
# Create additional builders to get all of the PostgreSQL utilities
#########################################################################

FROM postgres:12-alpine AS pg12-builder
FROM postgres:13-alpine AS pg13-builder
FROM postgres:14-alpine AS pg14-builder
FROM postgres:15-alpine AS pg15-builder
FROM postgres:16-alpine AS pg16-builder

FROM alpine:latest AS tool-builder

# Copy the PG binaries
COPY --from=pg12-builder /usr/local/bin/pg_dump /usr/local/pgsql/pgsql-12/
COPY --from=pg12-builder /usr/local/bin/pg_dumpall /usr/local/pgsql/pgsql-12/
COPY --from=pg12-builder /usr/local/bin/pg_restore /usr/local/pgsql/pgsql-12/
COPY --from=pg12-builder /usr/local/bin/psql /usr/local/pgsql/pgsql-12/

COPY --from=pg13-builder /usr/local/bin/pg_dump /usr/local/pgsql/pgsql-13/
COPY --from=pg13-builder /usr/local/bin/pg_dumpall /usr/local/pgsql/pgsql-13/
COPY --from=pg13-builder /usr/local/bin/pg_restore /usr/local/pgsql/pgsql-13/
COPY --from=pg13-builder /usr/local/bin/psql /usr/local/pgsql/pgsql-13/

COPY --from=pg14-builder /usr/local/bin/pg_dump /usr/local/pgsql/pgsql-14/
COPY --from=pg14-builder /usr/local/bin/pg_dumpall /usr/local/pgsql/pgsql-14/
COPY --from=pg14-builder /usr/local/bin/pg_restore /usr/local/pgsql/pgsql-14/
COPY --from=pg14-builder /usr/local/bin/psql /usr/local/pgsql/pgsql-14/

COPY --from=pg15-builder /usr/local/bin/pg_dump /usr/local/pgsql/pgsql-15/
COPY --from=pg15-builder /usr/local/bin/pg_dumpall /usr/local/pgsql/pgsql-15/
COPY --from=pg15-builder /usr/local/bin/pg_restore /usr/local/pgsql/pgsql-15/
COPY --from=pg15-builder /usr/local/bin/psql /usr/local/pgsql/pgsql-15/

COPY --from=pg16-builder /usr/local/bin/pg_dump /usr/local/pgsql/pgsql-16/
COPY --from=pg16-builder /usr/local/bin/pg_dumpall /usr/local/pgsql/pgsql-16/
COPY --from=pg16-builder /usr/local/bin/pg_restore /usr/local/pgsql/pgsql-16/
COPY --from=pg16-builder /usr/local/bin/psql /usr/local/pgsql/pgsql-16/

#########################################################################
# Assemble everything into the final container.
#########################################################################

FROM alpine:latest

# Copy in the Python packages
COPY --from=env-builder /venv /venv

# Copy in the tools
COPY --from=tool-builder /usr/local/pgsql /usr/local/
COPY --from=pg16-builder /usr/local/lib/libpq.so.5.16 /usr/lib/
COPY --from=pg16-builder /usr/lib/libzstd.so.1 /usr/lib/
COPY --from=pg16-builder /usr/lib/liblz4.so.1 /usr/lib/

RUN cd /usr/lib && \
    ln -sf libpq.so.5.16 libpq.so.5 && \
    ln -sf libpq.so.5.16 libpq.so

WORKDIR /pgadmin4
ENV PYTHONPATH=/pgadmin4

# Copy in the code and docs
COPY --from=app-builder /pgadmin4/web /pgadmin4
COPY --from=docs-builder /pgadmin4/docs /pgadmin4/docs
COPY pkg/docker/run_pgadmin.py /pgadmin4
COPY pkg/docker/gunicorn_config.py /pgadmin4
COPY pkg/docker/entrypoint.sh /entrypoint.sh

# License files
COPY LICENSE /pgadmin4/LICENSE
COPY DEPENDENCIES /pgadmin4/DEPENDENCIES

# Install runtime dependencies and configure everything in one RUN step
RUN sed -i 's/\r$//' /entrypoint.sh && \
    chmod +x /entrypoint.sh && \
    apk add \
        python3 \
        py3-pip \
        postfix \
        krb5-libs \
        libjpeg-turbo \
        shadow \
        sudo \
        tzdata \
        libedit \
        libldap \
        libcap \
        py3-cryptography \
        py3-bcrypt \
        py3-psutil \
        py3-pillow \
        py3-setuptools && \
    /venv/bin/python3 -m pip install --no-cache-dir gunicorn>=21.2.0 && \
    find / -type d -name '__pycache__' -exec rm -rf {} + && \
    useradd -r -u 5050 -g root -d /home/pgadmin -s /sbin/nologin pgadmin && \
    mkdir -p /home/pgadmin /var/lib/pgadmin /var/lib/bases_on /var/log/bases_on && \
    chown pgadmin:root /home/pgadmin /var/lib/pgadmin /var/lib/bases_on /var/log/bases_on && \
    chmod g=u /var/lib/pgadmin /var/lib/bases_on /var/log/bases_on && \
    touch /pgadmin4/config_distro.py && \
    chown pgadmin:root /pgadmin4/config_distro.py && \
    chmod g=u /pgadmin4/config_distro.py && \
    chmod g=u /etc/passwd && \
    setcap CAP_NET_BIND_SERVICE=+eip $(readlink -f /usr/bin/python3) && \
    echo "pgadmin ALL = NOPASSWD: /usr/sbin/postfix start, /bin/chown" > /etc/sudoers.d/postfix && \
    echo "pgadminr ALL = NOPASSWD: /usr/sbin/postfix start, /bin/chown" >> /etc/sudoers.d/postfix

USER pgadmin

# Finish up
VOLUME /var/lib/bases_on
EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
